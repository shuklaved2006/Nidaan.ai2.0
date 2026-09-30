const express = require('express');
const router = express.Router();
const { authorize, ROLES } = require('../middleware/auth');

module.exports = function(db) {
  // Get detailed FIR information (including Complainant, Victim, Accused, Acts/Sections)
  router.get('/:id/details', authorize(), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const caseId = parseInt(req.params.id);

      // Fetch the master case
      const caseRecord = await db.getCaseById(caseId);
      if (!caseRecord) {
        return res.status(404).json({ status: 'error', message: `Case/FIR with ID ${caseId} not found.` });
      }

      // Query complainant details
      const complainantQuery = `SELECT * FROM ComplainantDetails WHERE CaseMasterID = ${caseId}`;
      const complainants = await db.executeQuery(complainantQuery);

      // Query victim details
      const victimQuery = `SELECT * FROM Victim WHERE CaseMasterID = ${caseId}`;
      const victims = await db.executeQuery(victimQuery);

      // Query accused details
      const accusedQuery = `SELECT * FROM Accused WHERE CaseMasterID = ${caseId}`;
      const accused = await db.executeQuery(accusedQuery);

      // Query associated acts and sections
      const actsSectionsQuery = `SELECT * FROM ActSectionAssociation WHERE CaseMasterID = ${caseId}`;
      const actsSections = await db.executeQuery(actsSectionsQuery);

      res.json({
        status: 'success',
        data: {
          case: caseRecord,
          complainants: complainants,
          victims: victims,
          accused: accused,
          actsAndSections: actsSections
        }
      });
    } catch (error) {
      console.error('Error fetching detailed FIR info:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Register a new FIR (Station Admin or System Admin roles only)
  router.post('/register', authorize([ROLES.STATION_ADMIN, ROLES.SYSTEM_ADMIN]), async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ status: 'error', message: 'Database helper is not initialized.' });
      }

      const { caseData, complainantData, victims, accused, actsSections } = req.body;

      if (!caseData || !caseData.CrimeNo || !caseData.PoliceStationID) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing essential case data parameters: CrimeNo, PoliceStationID.'
        });
      }

      // Ensure case category is registered as FIR
      // Lookup value for CaseCategoryID = 1 is typically FIR or lookup from CaseCategory table
      const registeredCase = await db.createCase({
        ...caseData,
        CaseCategoryID: caseData.CaseCategoryID || 1 // fallback to 1 (FIR)
      });

      const caseId = registeredCase.CaseMasterID || registeredCase.ROWID; // Depending on what is returned

      // Insert associated entities if caseId is obtained successfully
      if (caseId) {
        // Insert Complainant
        if (complainantData) {
          const complainantTable = db.app.datastore().table('ComplainantDetails');
          await complainantTable.insertRow({ ...complainantData, CaseMasterID: caseId });
        }

        // Insert Victims
        if (Array.isArray(victims)) {
          const victimTable = db.app.datastore().table('Victim');
          for (const victim of victims) {
            await victimTable.insertRow({ ...victim, CaseMasterID: caseId });
          }
        }

        // Insert Accused
        if (Array.isArray(accused)) {
          const accusedTable = db.app.datastore().table('Accused');
          for (const acc of accused) {
            await accusedTable.insertRow({ ...acc, CaseMasterID: caseId });
          }
        }

        // Insert Acts & Sections
        if (Array.isArray(actsSections)) {
          const actsSecTable = db.app.datastore().table('ActSectionAssociation');
          for (const actSec of actsSections) {
            await actsSecTable.insertRow({ ...actSec, CaseMasterID: caseId });
          }
        }
      }

      // Trigger background events via Catalyst Signals & Circuits when a new FIR is registered
      if (caseId) {
        // 1. Execute Catalyst Circuit for backend analytics (e.g. updating graph files, cache invalidation)
        try {
          const circuitInstance = db.app.circuit().getCircuitInstance('FIR_Analytics_Circuit');
          await circuitInstance.execute('FIR_' + caseId + '_' + Date.now(), {
            caseId: caseId,
            crimeNo: caseData.CrimeNo,
            policeStationId: caseData.PoliceStationID,
            action: 'UPDATE_ANALYTICS',
            timestamp: new Date().toISOString()
          });
          console.log(`Successfully executed Catalyst Circuit: FIR_Analytics_Circuit for Case ID: ${caseId}`);
        } catch (circuitError) {
          console.warn('Circuit execution skipped or failed: ', circuitError.message);
        }

        // 2. Publish a Catalyst Signal event for client-side notifications/dashboard updates
        try {
          const signalPublisherUrl = process.env.CATALYST_SIGNAL_WEBHOOK_URL || 'https://api.zoho-catalyst.com/signals/v1/publish';
          if (process.env.CATALYST_SIGNAL_WEBHOOK_URL) {
            const axios = require('axios');
            await axios.post(signalPublisherUrl, {
              event_type: 'FIR_REGISTERED',
              payload: {
                caseId: caseId,
                crimeNo: caseData.CrimeNo,
                policeStationId: caseData.PoliceStationID,
                timestamp: new Date().toISOString()
              }
            });
            console.log(`Successfully published event to Catalyst Signals for Case ID: ${caseId}`);
          } else {
            console.log(`[Signal Mock] Published FIR_REGISTERED signal for Case ID: ${caseId}`);
          }
        } catch (signalError) {
          console.warn('Signal publication skipped or failed: ', signalError.message);
        }
      }

      res.status(201).json({
        status: 'success',
        message: 'FIR registered successfully.',
        data: {
          caseId: caseId,
          crimeNo: caseData.CrimeNo
        }
      });
    } catch (error) {
      console.error('Error registering FIR:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
};
