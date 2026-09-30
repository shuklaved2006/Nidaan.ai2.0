const express = require('express');
const cors = require('cors');
const path = require('path');

// 1. Register ts-node to compile and load TypeScript files dynamically.
// This allows app.js to require helper and model files written in TypeScript in the database directory.
try {
  require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
      target: 'es2022',
      allowJs: true,
      skipLibCheck: true
    }
  });
  console.log('Successfully registered ts-node in app.js');
} catch (e) {
  console.warn('Skipped ts-node registration:', e.message);
}

// 2. Import database helper dynamically to support both local dev and production builds
let DatabaseHelper;
try {
  // Primary: Load from the root database/ directory
  const dbHelperModule = require(path.join(__dirname, '../database/db_helper'));
  DatabaseHelper = dbHelperModule.DatabaseHelper;
  console.log('Successfully imported DatabaseHelper from root "../database/db_helper"');
} catch (err) {
  console.warn('Could not import from "../database/db_helper":', err.message);
  try {
    // Secondary/Fallback: Load from local copied folder inside backend (e.g. if deploying to Appsail)
    const dbHelperModule = require('./database/db_helper');
    DatabaseHelper = dbHelperModule.DatabaseHelper;
    console.log('Successfully imported DatabaseHelper from local "./database/db_helper"');
  } catch (localErr) {
    console.error('CRITICAL: DatabaseHelper could not be loaded from any location:', localErr.message);
  }
}

// Initialize DatabaseHelper instance
let dbInstance = null;
if (DatabaseHelper) {
  try {
    dbInstance = new DatabaseHelper();
    console.log('DatabaseHelper instance initialized successfully.');
  } catch (initErr) {
    console.error('Failed to instantiate DatabaseHelper:', initErr.message);
  }
}

// 3. Initialize Express App
const app = express();
const catalyst = require('zcatalyst-sdk-node');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  try {
    res.locals.catalyst = catalyst.initialize(req);
  } catch (err) {
    // Continue without catalyst context if running outside AppSail without headers
  }
  next();
});

// Serve static assets or logs if necessary
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    databaseConnected: !!dbInstance
  });
});

// Import and group routes logically under /api
const caseRoutes = require('./routes/cases');
const firRoutes = require('./routes/fir');
const workloadRoutes = require('./routes/workload');
const reportingRoutes = require('./routes/reporting');

app.use('/api/cases', caseRoutes(dbInstance));
app.use('/api/fir', firRoutes(dbInstance));
app.use('/api/workload', workloadRoutes(dbInstance));
app.use('/api/reporting', reportingRoutes(dbInstance));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Express server is running on port ${PORT}`);
});

module.exports = app;
