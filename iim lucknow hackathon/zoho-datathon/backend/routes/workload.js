const express = require('express');
const router = express.Router();
const { authorize, ROLES } = require('../middleware/auth');

module.exports = function(db) {
  // Get active case counts for all officers in a unit/station
  router.get('/summary', authorize([ROLES.COMMAND_CENTRE, ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN]), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const unitId = req.query.unitId;
      
      // Select count of active cases per officer (joining Employee for name/rank details)
      let query = `
        SELECT e.EmployeeID, e.FirstName, e.KGID, r.RankName, COUNT(c.CaseMasterID) as ActiveCasesCount 
        FROM Employee e
        LEFT JOIN CaseMaster c ON c.PolicePersonID = e.EmployeeID AND c.CaseStatusID = 1
        LEFT JOIN Rank r ON e.RankID = r.RankID
      `;

      if (unitId) {
        query += ` WHERE e.UnitID = ${parseInt(unitId)} `;
      }

      query += ` GROUP BY e.EmployeeID, e.FirstName, e.KGID, r.RankName`;

      const workloadSummary = await db.executeQuery(query);
      res.json({ status: 'success', data: workloadSummary });
    } catch (error) {
      console.error('Error fetching workload summary:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Get specific officer workload detail
  router.get('/:officerId', authorize(), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const officerId = parseInt(req.params.officerId);

      // Fetch Officer information
      const officerQuery = `
        SELECT e.*, r.RankName, d.DesignationName 
        FROM Employee e
        LEFT JOIN Rank r ON e.RankID = r.RankID
        LEFT JOIN Designation d ON e.DesignationID = d.DesignationID
        WHERE e.EmployeeID = ${officerId}
      `;
      const officers = await db.executeQuery(officerQuery);
      if (officers.length === 0) {
        return res.status(404).json({ status: 'error', message: `Officer with ID ${officerId} not found.` });
      }

      // Fetch cases currently assigned to officer (CaseStatusID 1 = Under Investigation)
      const activeCasesQuery = `
        SELECT CaseMasterID, CrimeNo, CrimeRegisteredDate, CaseCategoryID, GravityOffenceID 
        FROM CaseMaster 
        WHERE PolicePersonID = ${officerId} AND CaseStatusID = 1
      `;
      const activeCases = await db.executeQuery(activeCasesQuery);

      res.json({
        status: 'success',
        data: {
          officer: officers[0],
          activeCases: activeCases,
          activeCasesCount: activeCases.length
        }
      });
    } catch (error) {
      console.error('Error fetching officer workload details:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Assign case to an officer (Investigation Officer)
  // Accessible by Station Admin or System Admin
  router.post('/assign', authorize([ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN]), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const { caseId, officerId } = req.body;

      if (!caseId || !officerId) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing parameters: caseId and officerId are required.'
        });
      }

      // Verify the officer exists
      const officerCheck = await db.executeQuery(`SELECT EmployeeID FROM Employee WHERE EmployeeID = ${parseInt(officerId)}`);
      if (officerCheck.length === 0) {
        return res.status(404).json({ status: 'error', message: `Officer with ID ${officerId} not found.` });
      }

      // Update CaseMaster with the new officer assignment
      const table = db.app.datastore().table('CaseMaster');
      await table.updateRow({
        ROWID: caseId, // In Zoho Catalyst, row updates use ROWID or primary key depending on mapping
        PolicePersonID: officerId
      });

      res.json({
        status: 'success',
        message: `Case ${caseId} assigned to officer ${officerId} successfully.`
      });
    } catch (error) {
      console.error('Error assigning case:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
};
