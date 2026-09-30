const express = require('express');
const router = express.Router();
const { authorize, ROLES } = require('../middleware/auth');

module.exports = function(db) {
  // Get all cases (Search / Filter)
  // Accessible by Command Centre, Station Admin, System Admin
  router.get('/', authorize([ROLES.COMMAND_CENTRE, ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN, ROLES.INVESTIGATION_OFFICER]), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      // Simple fetch cases with optional query parameters (e.g. station, status)
      const stationId = req.query.stationId;
      const statusId = req.query.statusId;
      
      let query = `SELECT * FROM CaseMaster`;
      const conditions = [];
      if (stationId) {
        conditions.push(`PoliceStationID = ${parseInt(stationId)}`);
      }
      if (statusId) {
        conditions.push(`CaseStatusID = ${parseInt(statusId)}`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }
      
      // Limit to 100 cases for performance
      query += ` LIMIT 100`;

      const cases = await db.executeQuery(query);
      res.json({ status: 'success', data: cases });
    } catch (error) {
      console.error('Error fetching cases:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Get specific case by ID
  router.get('/:id', authorize(), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const caseId = parseInt(req.params.id);
      const caseRecord = await db.getCaseById(caseId);

      if (!caseRecord) {
        return res.status(404).json({ status: 'error', message: `Case with ID ${caseId} not found.` });
      }

      res.json({ status: 'success', data: caseRecord });
    } catch (error) {
      console.error('Error fetching case by ID:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Create a new case
  // Accessible only by Station Administrator and System Administrator
  router.post('/', authorize([ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN]), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const caseData = req.body;
      if (!caseData.CrimeNo || !caseData.CaseCategoryID || !caseData.PoliceStationID) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required case parameters: CrimeNo, CaseCategoryID, and PoliceStationID.'
        });
      }

      const response = await db.createCase(caseData);
      res.status(211).json({ status: 'success', message: 'Case created successfully', data: response });
    } catch (error) {
      console.error('Error creating case:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
};
