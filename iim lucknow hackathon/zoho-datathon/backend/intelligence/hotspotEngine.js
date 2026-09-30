/**
 * Calculates dynamic crime density based on spatial coordinates
 * @param {Array} cases - Array of FIR objects with lat/lng
 * @param {Number} searchRadiusKm - Search radius in km to group hotspots
 */
const calculateDensity = (cases, searchRadiusKm = 2.0) => {
    const hotspots = [];

    // Simple clustering algorithm for hotspots based on spatial density
    cases.forEach((c) => {
        if (!c.latitude || !c.longitude) return;

        let foundCluster = false;
        for (let hotspot of hotspots) {
            const dist = getDistanceFromLatLonInKm(
                hotspot.centerLat, hotspot.centerLng,
                c.latitude, c.longitude
            );

            if (dist <= searchRadiusKm) {
                hotspot.cases.push(c);
                hotspot.weight += getCrimeWeight(c.crimeType);
                
                // Recalculate center (simple average)
                hotspot.centerLat = (hotspot.centerLat * (hotspot.cases.length - 1) + c.latitude) / hotspot.cases.length;
                hotspot.centerLng = (hotspot.centerLng * (hotspot.cases.length - 1) + c.longitude) / hotspot.cases.length;
                
                foundCluster = true;
                break;
            }
        }

        if (!foundCluster) {
            hotspots.push({
                id: `hs_${Math.random().toString(36).substr(2, 9)}`,
                centerLat: c.latitude,
                centerLng: c.longitude,
                cases: [c],
                weight: getCrimeWeight(c.crimeType)
            });
        }
    });

    // Sort by density/weight descending
    return hotspots.sort((a, b) => b.weight - a.weight);
};

// Helper: Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getCrimeWeight(crimeType) {
    const weights = {
        'MURDER': 10,
        'ROBBERY': 7,
        'THEFT': 4,
        'ASSAULT': 6
    };
    return weights[crimeType.toUpperCase()] || 2;
}

module.exports = {
    calculateDensity
};
