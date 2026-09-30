/**
 * Bilingual AI Investigation Assistant Pipeline
 * Parses English, Kannada, and Kanglish queries to intents and DB queries
 * Integrated with Zoho Catalyst Zia Services
 */
const catalyst = require('zcatalyst-sdk-node');

const ENGLISH_KEYWORDS = {
    'thief': 'THEFT',
    'stolen': 'THEFT',
    'murder': 'MURDER',
    'kill': 'MURDER',
    'vehicle': 'VEHICLE',
    'car': 'VEHICLE',
    'bike': 'VEHICLE',
    'search': 'SEARCH',
    'find': 'SEARCH',
    'location': 'LOCATION',
    'hotspot': 'LOCATION'
};

const parseQuery = async (queryText) => {
    const app = catalyst.initialize();
    const zia = app.zia();

    // Zia Language Detection
    let detectedLanguage = 'English';
    try {
        const languageResponse = await zia.detectLanguage([queryText]);
        if (languageResponse && languageResponse.length > 0) {
            detectedLanguage = languageResponse[0].language_name;
        }
    } catch (error) {
        console.error('Zia Detect Language Error:', error);
    }

    // Zia Translation to English if not English
    let processingText = queryText;
    if (detectedLanguage !== 'English') {
        try {
            const translation = await zia.translateText(queryText, detectedLanguage, 'English');
            if (translation && translation.translated_text) {
                processingText = translation.translated_text;
            }
        } catch (error) {
            console.error('Zia Translate Text Error:', error);
        }
    }

    const normalized = processingText.toLowerCase();
    const words = normalized.split(/\s+/);
    
    let intent = 'UNKNOWN';
    let entities = { crimeTypes: [], targets: [] };
    
    words.forEach(word => {
        if (ENGLISH_KEYWORDS[word]) {
            const mapped = ENGLISH_KEYWORDS[word];
            if (['THEFT', 'MURDER'].includes(mapped)) entities.crimeTypes.push(mapped);
            else if (['VEHICLE', 'LOCATION'].includes(mapped)) entities.targets.push(mapped);
            else if (mapped === 'SEARCH') intent = 'SEARCH';
        }
    });

    if (intent === 'UNKNOWN' && (entities.crimeTypes.length > 0 || entities.targets.length > 0)) {
        intent = 'SEARCH';
    }

    return {
        originalQuery: queryText,
        detectedLanguage,
        translatedQuery: processingText,
        intent,
        entities
    };
};

const generateZCQL = (parsedIntent) => {
    let query = `SELECT * FROM FIR`;
    let conditions = [];

    if (parsedIntent.entities.crimeTypes.length > 0) {
        const types = parsedIntent.entities.crimeTypes.map(t => `'${t}'`).join(', ');
        conditions.push(`CrimeType IN (${types})`);
    }

    if (parsedIntent.entities.targets.includes('VEHICLE')) {
        conditions.push(`VehicleNumber IS NOT NULL`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    return query;
};

const processInvestigationQuery = async (queryText) => {
    const parsed = await parseQuery(queryText);
    const sql = generateZCQL(parsed);
    
    return {
        success: true,
        parsed,
        generatedQuery: sql,
        message: 'Query parsed successfully using Zoho Catalyst Zia Services.'
    };
};

module.exports = {
    processInvestigationQuery,
    parseQuery,
    generateZCQL
};
