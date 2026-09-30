const assert = require('assert');
const { authorize, ROLES } = require('./middleware/auth');
const { processInvestigationQuery } = require('./intelligence/aiAssistant');
const { calculateDensity } = require('./intelligence/hotspotEngine');

async function runTests() {
    console.log("Running QA & Security Audits...\n");

    // 1. Security Authorization Test
    console.log("=== Security Authorization Middleware Tests ===");
    const reqMock = (role) => ({ headers: { 'x-user-role': role } });
    const resMock = () => {
        const res = {};
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => { res.body = data; return res; };
        return res;
    };
    
    // Test System Admin access to Station Admin route
    let nextCalled = false;
    let res = resMock();
    await authorize([ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN])(reqMock(ROLES.SYSTEM_ADMIN), res, () => { nextCalled = true; });
    assert(nextCalled === true, "System admin should be authorized");
    console.log("✅ System Admin authorized for restricted route");

    // Test Invalid Role access
    nextCalled = false;
    res = resMock();
    await authorize([ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN])(reqMock(ROLES.INVESTIGATION_OFFICER), res, () => { nextCalled = true; });
    assert(nextCalled === false, "Investigation Officer should not be authorized");
    assert(res.statusCode === 403, "Should return 403 Forbidden");
    console.log("✅ Investigation Officer correctly rejected from restricted route");

    // Test Missing Role
    res = resMock();
    await authorize([ROLES.STATION_ADMIN])({ headers: {} }, res, () => {});
    assert(res.statusCode === 401, "Should return 401 Unauthorized");
    console.log("✅ Missing role correctly returns 401");

    // 2. Intelligence Engine & Bilingual Assistant Test
    console.log("\n=== Intelligence Engine (Bilingual Assistant) Tests ===");
    const q1 = processInvestigationQuery("kalla car");
    assert(q1.parsed.intent === 'SEARCH', "Intent should be SEARCH");
    assert(q1.parsed.entities.crimeTypes.includes('THEFT'), "Should identify THEFT");
    assert(q1.parsed.entities.targets.includes('VEHICLE'), "Should identify VEHICLE");
    assert(q1.generatedQuery.includes("CrimeType IN ('THEFT')") && q1.generatedQuery.includes("VehicleNumber IS NOT NULL"), "ZCQL should be correct");
    console.log("✅ Bilingual Assistant parsed 'kalla car' correctly (Kanglish)");

    const q2 = processInvestigationQuery("murder location");
    assert(q2.parsed.intent === 'SEARCH', "Intent should be SEARCH");
    assert(q2.parsed.entities.crimeTypes.includes('MURDER'), "Should identify MURDER");
    console.log("✅ Bilingual Assistant parsed 'murder location' correctly (English)");

    // 3. Hotspot Engine Load / Performance Test
    console.log("\n=== Hotspot Engine Performance Audit ===");
    const mockCases = [];
    for(let i=0; i<10000; i++) {
        mockCases.push({
            latitude: 12.9716 + (Math.random() * 0.1 - 0.05),
            longitude: 77.5946 + (Math.random() * 0.1 - 0.05),
            crimeType: ['THEFT', 'MURDER', 'ROBBERY', 'ASSAULT'][Math.floor(Math.random() * 4)]
        });
    }
    
    const start = process.hrtime();
    const hotspots = calculateDensity(mockCases, 1.0);
    const end = process.hrtime(start);
    const timeMs = (end[0] * 1000) + (end[1] / 1000000);
    
    assert(hotspots.length > 0, "Hotspots should be generated");
    console.log(`✅ Hotspot calculations for 10,000 cases completed in ${timeMs.toFixed(2)} ms`);
    console.log(`✅ Identified ${hotspots.length} clusters`);
    
    if (timeMs > 500) {
        console.warn("⚠️ Warning: Hotspot calculation took over 500ms. Consider optimizing D3/Leaflet rendering payload.");
    }
    
    console.log("\nAll audits passed successfully.");
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
