const express = require('express');
const router = express.Router();
const { authorize, ROLES } = require('../middleware/auth');

module.exports = function(db) {
  // Get overview dashboard metrics (Total cases, Active, Closed, by gravity)
  router.get('/dashboard-overview', authorize([ROLES.COMMAND_CENTRE, ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN]), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const totalCasesQuery = `SELECT COUNT(CaseMasterID) as count FROM CaseMaster`;
      const activeCasesQuery = `SELECT COUNT(CaseMasterID) as count FROM CaseMaster WHERE CaseStatusID = 1`; // Under Investigation
      const closedCasesQuery = `SELECT COUNT(CaseMasterID) as count FROM CaseMaster WHERE CaseStatusID = 3`; // Closed
      
      const totalRes = await db.executeQuery(totalCasesQuery);
      const activeRes = await db.executeQuery(activeCasesQuery);
      const closedRes = await db.executeQuery(closedCasesQuery);

      // Grouped by Category counts
      const categoryQuery = `
        SELECT c.LookupValue as CategoryName, COUNT(m.CaseMasterID) as count 
        FROM CaseMaster m 
        JOIN CaseCategory c ON m.CaseCategoryID = c.CaseCategoryID 
        GROUP BY c.LookupValue
      `;
      const categoryRes = await db.executeQuery(categoryQuery);

      // Grouped by Gravity counts
      const gravityQuery = `
        SELECT g.LookupValue as GravityName, COUNT(m.CaseMasterID) as count 
        FROM CaseMaster m 
        JOIN GravityOffence g ON m.GravityOffenceID = g.GravityOffenceID 
        GROUP BY g.LookupValue
      `;
      const gravityRes = await db.executeQuery(gravityQuery);

      res.json({
        status: 'success',
        data: {
          metrics: {
            totalCases: totalRes[0] ? totalRes[0].count : 0,
            activeCases: activeRes[0] ? activeRes[0].count : 0,
            closedCases: closedRes[0] ? closedRes[0].count : 0
          },
          byCategory: categoryRes,
          byGravity: gravityRes
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard overview metrics:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Get incident coordinates for spatial hotspot mapping (geospatial analytics)
  router.get('/hotspots', authorize(), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      // Fetch latitude, longitude, and minor metadata for active or recently registered cases
      const query = `
        SELECT CaseMasterID, CrimeNo, latitude, longitude, CrimeMajorHeadID, CrimeRegisteredDate 
        FROM CaseMaster 
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        LIMIT 500
      `;

      const hotspots = await db.executeQuery(query);
      res.json({ status: 'success', data: hotspots });
    } catch (error) {
      console.error('Error fetching hotspot data:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
};
