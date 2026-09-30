import { faker } from '@faker-js/faker';
import { DatabaseHelper } from '../../database/db_helper';
import * as path from 'path';
import * as fs from 'fs';

async function seedSimulationData() {
  console.log('Starting Simulation Seeder...');

  // Set environment variables to target SQLite staging database
  process.env.NODE_ENV = 'staging';
  process.env.DB_TYPE = 'sqlite';

  const dbPath = path.join(__dirname, '../../database/staging.db');
  console.log('Target SQLite Database path:', dbPath);

  // Clean slate: Delete existing staging.db if it exists
  if (fs.existsSync(dbPath)) {
    console.log('Deleting existing staging.db for a clean seed...');
    try {
      fs.unlinkSync(dbPath);
    } catch (err: any) {
      console.warn('Could not delete staging.db, proceeding anyway:', err.message);
    }
  }

  // Initialize DatabaseHelper
  const dbHelper = new DatabaseHelper();

  // Wait for SQLite schema DDL execution to complete
  await new Promise<void>((resolve) => {
    const check = () => {
      const sqliteDb = (dbHelper as any).sqliteDb;
      if (!sqliteDb) {
        setTimeout(check, 100);
        return;
      }
      sqliteDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='CaseMaster';", (err: any, row: any) => {
        if (err || !row) {
          setTimeout(check, 100);
        } else {
          resolve();
        }
      });
    };
    check();
  });
  console.log('SQLite schema tables verified. Proceeding with seed...');

  // Dates timeline setup
  const startDate = new Date('2022-01-01T00:00:00Z');
  const endDate = new Date('2026-07-01T00:00:00Z');

  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const getOffsetDate = (base: Date, hours: number) => {
    return new Date(base.getTime() + hours * 60 * 60 * 1000);
  };

  // --- 1. Populate Master Reference Tables ---
  console.log('Populating Master/Reference Tables...');

  // State
  await dbHelper.app.datastore().table('State').insertRow({
    StateID: 1,
    StateName: 'Karnataka',
    NationalityID: 1,
    Active: 1
  });

  // Districts (1 to 10)
  for (let i = 1; i <= 10; i++) {
    await dbHelper.app.datastore().table('District').insertRow({
      DistrictID: i,
      DistrictName: `District ${i}`,
      StateID: 1,
      Active: 1
    });
  }

  // UnitType
  await dbHelper.app.datastore().table('UnitType').insertRow({
    UnitTypeID: 1,
    UnitTypeName: 'Police Station',
    CityDistState: 'Karnataka',
    Hierarchy: 1,
    Active: 1
  });

  // Units / Police Stations (1 to 35)
  for (let i = 1; i <= 35; i++) {
    await dbHelper.app.datastore().table('Unit').insertRow({
      UnitID: i,
      UnitName: faker.location.city() + ' Police Station',
      TypeID: 1,
      ParentUnit: null,
      NationalityID: 1,
      StateID: 1,
      DistrictID: ((i - 1) % 10) + 1,
      Active: 1
    });
  }

  // Ranks (1 to 5)
  for (let i = 1; i <= 5; i++) {
    await dbHelper.app.datastore().table('Rank').insertRow({
      RankID: i,
      RankName: `Rank ${i}`,
      Hierarchy: i,
      Active: 1
    });
  }

  // Designations (1 to 5)
  for (let i = 1; i <= 5; i++) {
    await dbHelper.app.datastore().table('Designation').insertRow({
      DesignationID: i,
      DesignationName: `Designation ${i}`,
      Active: 1,
      SortOrder: i
    });
  }

  // CaseCategory
  await dbHelper.app.datastore().table('CaseCategory').insertRow({ CaseCategoryID: 1, LookupValue: 'FIR' });
  await dbHelper.app.datastore().table('CaseCategory').insertRow({ CaseCategoryID: 2, LookupValue: 'UDR' });
  await dbHelper.app.datastore().table('CaseCategory').insertRow({ CaseCategoryID: 3, LookupValue: 'Zero FIR' });

  // GravityOffence
  await dbHelper.app.datastore().table('GravityOffence').insertRow({ GravityOffenceID: 1, LookupValue: 'Heinous' });
  await dbHelper.app.datastore().table('GravityOffence').insertRow({ GravityOffenceID: 2, LookupValue: 'Non-Heinous' });

  // CrimeHead (1 to 5)
  for (let i = 1; i <= 5; i++) {
    await dbHelper.app.datastore().table('CrimeHead').insertRow({
      CrimeHeadID: i,
      CrimeGroupName: `Crime Group ${i}`,
      Active: 1
    });
  }

  // CrimeSubHead (1 to 20)
  for (let i = 1; i <= 20; i++) {
    await dbHelper.app.datastore().table('CrimeSubHead').insertRow({
      CrimeSubHeadID: i,
      CrimeHeadID: ((i - 1) % 5) + 1,
      CrimeHeadName: `Sub Crime ${i}`,
      SeqID: i
    });
  }

  // CasteMaster (1 to 10)
  for (let i = 1; i <= 10; i++) {
    await dbHelper.app.datastore().table('CasteMaster').insertRow({
      caste_master_id: i,
      caste_master_name: `Caste ${i}`
    });
  }

  // ReligionMaster (1 to 5)
  for (let i = 1; i <= 5; i++) {
    await dbHelper.app.datastore().table('ReligionMaster').insertRow({
      ReligionID: i,
      ReligionName: `Religion ${i}`
    });
  }

  // OccupationMaster (1 to 10)
  for (let i = 1; i <= 10; i++) {
    await dbHelper.app.datastore().table('OccupationMaster').insertRow({
      OccupationID: i,
      OccupationName: `Occupation ${i}`
    });
  }

  // CaseStatusMaster (1 to 3)
  await dbHelper.app.datastore().table('CaseStatusMaster').insertRow({ CaseStatusID: 1, CaseStatusName: 'Under Investigation' });
  await dbHelper.app.datastore().table('CaseStatusMaster').insertRow({ CaseStatusID: 2, CaseStatusName: 'Charge Sheeted' });
  await dbHelper.app.datastore().table('CaseStatusMaster').insertRow({ CaseStatusID: 3, CaseStatusName: 'Closed' });

  // Courts (1 to 15)
  for (let i = 1; i <= 15; i++) {
    await dbHelper.app.datastore().table('Court').insertRow({
      CourtID: i,
      CourtName: 'District Court ' + faker.location.city(),
      DistrictID: ((i - 1) % 10) + 1,
      StateID: 1,
      Active: 1
    });
  }

  // Acts & Sections (IPC 302, 379, 420, 395)
  await dbHelper.app.datastore().table('Act').insertRow({ ActCode: 'IPC', ActDescription: 'Indian Penal Code', ShortName: 'IPC', Active: 1 });
  await dbHelper.app.datastore().table('Section').insertRow({ ActCode: 'IPC', SectionCode: '302', SectionDescription: 'Murder', Active: 1 });
  await dbHelper.app.datastore().table('Section').insertRow({ ActCode: 'IPC', SectionCode: '379', SectionDescription: 'Theft', Active: 1 });
  await dbHelper.app.datastore().table('Section').insertRow({ ActCode: 'IPC', SectionCode: '420', SectionDescription: 'Cheating', Active: 1 });
  await dbHelper.app.datastore().table('Section').insertRow({ ActCode: 'IPC', SectionCode: '395', SectionDescription: 'Dacoity', Active: 1 });

  // --- 2. Generate Officers (Employees) ---
  console.log('Generating 80 Officers...');
  for (let i = 1; i <= 80; i++) {
    await dbHelper.app.datastore().table('Employee').insertRow({
      EmployeeID: i,
      DistrictID: faker.number.int({ min: 1, max: 10 }),
      UnitID: faker.number.int({ min: 1, max: 35 }),
      RankID: faker.number.int({ min: 1, max: 5 }),
      DesignationID: faker.number.int({ min: 1, max: 5 }),
      KGID: 'KG' + faker.string.numeric(6) + i,
      FirstName: faker.person.fullName(),
      EmployeeDOB: faker.date.birthdate({ min: 25, max: 60, mode: 'age' }),
      GenderID: faker.number.int({ min: 1, max: 2 }),
      BloodGroupID: faker.number.int({ min: 1, max: 8 }),
      PhysicallyChallenged: 0,
      AppointmentDate: faker.date.past({ years: 10 })
    });
  }

  // Narratives Configuration
  const narratives = [
    { name: 'Operation Night Glass', type: 'Primary' },
    { name: 'Chain Riders', type: 'Primary' },
    { name: 'Cipher Network', type: 'Primary' },
    { name: 'Falcon Auto Theft', type: 'Primary' },
    { name: 'Silent Streets', type: 'Primary' },
    { name: 'Festival Shield', type: 'Primary' },
    { name: 'Shadow Extortion', type: 'Primary' },
    { name: 'Missing Threads', type: 'Primary' },
    { name: 'Domestic violence', type: 'Secondary' },
    { name: 'Illegal racing', type: 'Secondary' },
    { name: 'Assault', type: 'Secondary' },
    { name: 'Drug possession', type: 'Secondary' },
    { name: 'Public vandalism', type: 'Secondary' },
    { name: 'ATM theft', type: 'Secondary' },
    { name: 'Construction site theft', type: 'Secondary' },
    { name: 'School-area incidents', type: 'Secondary' },
    { name: 'Commercial burglary', type: 'Secondary' },
    { name: 'Fraud against elderly', type: 'Secondary' },
    { name: 'Market pickpocketing', type: 'Secondary' },
    { name: 'Public disorder', type: 'Secondary' }
  ];

  // --- 3. Core Entities Setup ---
  console.log('Generating and inserting core crime data...');

  const totalCases = 250;
  const totalCriminals = 180;
  const totalVictims = 320;
  const totalComplainants = 250;
  const totalArrests = 120;
  const totalChargesheets = 90;

  // Let's create the 180 criminals data pool first
  const criminalsDataPool = [];
  for (let i = 1; i <= totalCriminals; i++) {
    criminalsDataPool.push({
      AccusedMasterID: i,
      AccusedName: faker.person.fullName(),
      AgeYear: faker.number.int({ min: 18, max: 60 }),
      GenderID: faker.helpers.arrayElement([1, 2]),
      PersonID: 'A' + i,
      tier: i <= 8 ? 'A' : (i <= 33 ? 'B' : 'C'),
      gang: faker.helpers.arrayElement(['Glass Breakers', 'Chain Riders', 'Cipher Network', 'Falcon Crew', 'None'])
    });
  }

  // Let's create the 320 victims data pool
  const victimsDataPool = [];
  for (let i = 1; i <= totalVictims; i++) {
    victimsDataPool.push({
      VictimMasterID: i,
      VictimName: faker.person.fullName(),
      AgeYear: faker.number.int({ min: 18, max: 80 }),
      GenderID: faker.helpers.arrayElement([1, 2]),
      VictimPolice: faker.helpers.arrayElement(['0', '1'])
    });
  }

  // Let's create the 250 complainants data pool
  const complainantsDataPool = [];
  for (let i = 1; i <= totalComplainants; i++) {
    complainantsDataPool.push({
      ComplainantID: i,
      ComplainantName: faker.person.fullName(),
      AgeYear: faker.number.int({ min: 20, max: 70 }),
      OccupationID: faker.number.int({ min: 1, max: 10 }),
      ReligionID: faker.number.int({ min: 1, max: 5 }),
      CasteID: faker.number.int({ min: 1, max: 10 }),
      GenderID: faker.helpers.arrayElement([1, 2])
    });
  }

  const casesInserted: any[] = [];
  const accusedInserted: any[] = [];
  const victimsInserted: any[] = [];
  const complainantsInserted: any[] = [];
  const osintFeeds: any[] = [];
  const aiSummaries: any[] = [];
  const digitalAssets: any[] = [];

  // Insert 250 cases
  for (let i = 1; i <= totalCases; i++) {
    const narrative = narratives[(i - 1) % narratives.length];
    const regDate = randomDate(startDate, endDate);
    const incidentFrom = getOffsetDate(regDate, -faker.number.int({ min: 12, max: 72 }));
    const incidentTo = getOffsetDate(incidentFrom, faker.number.int({ min: 1, max: 6 }));

    const caseMaster = {
      CaseMasterID: i,
      CrimeNo: 'FIR' + faker.string.numeric(12),
      CaseNo: regDate.getFullYear().toString() + String(i).padStart(5, '0'),
      CrimeRegisteredDate: regDate,
      PolicePersonID: faker.number.int({ min: 1, max: 80 }),
      PoliceStationID: faker.number.int({ min: 1, max: 35 }),
      CaseCategoryID: 1,
      GravityOffenceID: faker.helpers.arrayElement([1, 2]),
      CrimeMajorHeadID: faker.number.int({ min: 1, max: 5 }),
      CrimeMinorHeadID: faker.number.int({ min: 1, max: 20 }),
      CaseStatusID: i <= totalChargesheets ? 2 : faker.helpers.arrayElement([1, 3]), // Ensure we match chargesheet status if chargesheeted
      CourtID: faker.number.int({ min: 1, max: 15 }),
      IncidentFromDate: incidentFrom,
      IncidentToDate: incidentTo,
      InfoReceivedPSDate: regDate,
      latitude: faker.location.latitude({ min: 12.0, max: 15.0 }), // Karnataka lat
      longitude: faker.location.longitude({ min: 75.0, max: 78.0 }), // Karnataka lon
      BriefFacts: `Narrative [${narrative.name}]: ` + faker.lorem.paragraph()
    };

    const insertedCase = await dbHelper.createCase(caseMaster);
    casesInserted.push(insertedCase);

    // Link Complainant: exactly 1 per case
    const complainant = complainantsDataPool[i - 1];
    const insertedComplainant = await dbHelper.app.datastore().table('ComplainantDetails').insertRow({
      ComplainantID: complainant.ComplainantID,
      CaseMasterID: i,
      ComplainantName: complainant.ComplainantName,
      AgeYear: complainant.AgeYear,
      OccupationID: complainant.OccupationID,
      ReligionID: complainant.ReligionID,
      CasteID: complainant.CasteID,
      GenderID: complainant.GenderID
    });
    complainantsInserted.push(insertedComplainant);

    // Link Act/Section Association
    await dbHelper.app.datastore().table('ActSectionAssociation').insertRow({
      CaseMasterID: i,
      ActCode: 'IPC',
      SectionCode: faker.helpers.arrayElement(['302', '379', '420', '395']),
      ActOrderID: 1,
      SectionOrderID: 1
    });
  }

  // Link exactly 180 Criminals to cases 1 to 180
  for (let i = 1; i <= totalCriminals; i++) {
    const accusedObj = criminalsDataPool[i - 1];
    const insertedAccused = await dbHelper.app.datastore().table('Accused').insertRow({
      AccusedMasterID: i,
      CaseMasterID: i, // Linked to cases 1..180
      AccusedName: accusedObj.AccusedName,
      AgeYear: accusedObj.AgeYear,
      GenderID: accusedObj.GenderID,
      PersonID: accusedObj.PersonID
    });
    accusedInserted.push(insertedAccused);
  }

  // Link exactly 320 Victims to cases
  // Cases 1 to 70 each get 2 victims (140 victims)
  // Cases 71 to 250 each get 1 victim (180 victims)
  let victimIdx = 0;
  for (let caseId = 1; caseId <= totalCases; caseId++) {
    const limit = caseId <= 70 ? 2 : 1;
    for (let k = 0; k < limit; k++) {
      const victimObj = victimsDataPool[victimIdx++];
      const insertedVictim = await dbHelper.app.datastore().table('Victim').insertRow({
        VictimMasterID: victimObj.VictimMasterID,
        CaseMasterID: caseId,
        VictimName: victimObj.VictimName,
        AgeYear: victimObj.AgeYear,
        GenderID: victimObj.GenderID,
        VictimPolice: victimObj.VictimPolice
      });
      victimsInserted.push(insertedVictim);
    }
  }

  // Generate exactly 120 arrests
  // Select first 120 accused (AccusedMasterID 1 to 120)
  for (let i = 1; i <= totalArrests; i++) {
    const accused = accusedInserted[i - 1];
    const associatedCase = casesInserted[accused.CaseMasterID - 1];
    const arrestDate = getOffsetDate(new Date(associatedCase.CrimeRegisteredDate), faker.number.int({ min: 24, max: 120 }));

    await dbHelper.app.datastore().table('ArrestSurrender').insertRow({
      ArrestSurrenderID: i,
      CaseMasterID: accused.CaseMasterID,
      ArrestSurrenderTypeID: 1, // Arrest
      ArrestSurrenderDate: arrestDate,
      ArrestSurrenderStateId: 1,
      ArrestSurrenderDistrictId: associatedCase.PoliceStationID % 10 + 1,
      PoliceStationID: associatedCase.PoliceStationID,
      IOID: associatedCase.PolicePersonID,
      CourtID: associatedCase.CourtID,
      AccusedMasterID: accused.AccusedMasterID,
      IsAccused: 1,
      IsComplainantAccused: 0
    });

    await dbHelper.app.datastore().table('inv_arrestsurrenderaccused').insertRow({
      ArrestSurrenderID: i,
      AccusedMasterID: accused.AccusedMasterID
    });
  }

  // Generate exactly 90 chargesheets
  // Select first 90 cases (CaseMasterID 1 to 90)
  for (let i = 1; i <= totalChargesheets; i++) {
    const associatedCase = casesInserted[i - 1];
    const csDate = getOffsetDate(new Date(associatedCase.CrimeRegisteredDate), faker.number.int({ min: 240, max: 720 }));

    await dbHelper.app.datastore().table('ChargesheetDetails').insertRow({
      CSID: i,
      CaseMasterID: associatedCase.CaseMasterID,
      csdate: csDate,
      cstype: 'A', // Chargesheet
      PolicePersonID: associatedCase.PolicePersonID
    });
  }

  // Generate OSINT feeds: 100 metadata records
  console.log('Generating 100 OSINT records...');
  for (let i = 1; i <= 100; i++) {
    const associatedCaseId = faker.helpers.arrayElement(casesInserted).CaseMasterID;
    const associatedCase = casesInserted[associatedCaseId - 1];
    const publishedAt = getOffsetDate(new Date(associatedCase.CrimeRegisteredDate), -faker.number.int({ min: 1, max: 24 }));

    const osintRecord = {
      feed_id: faker.string.uuid(),
      source_platform: faker.helpers.arrayElement(['X', 'Instagram', 'News', 'Community Forum']),
      publisher_name: faker.internet.username(),
      content: faker.lorem.sentence() + ` #CrimeAnalytics #SecurityAlert`,
      published_at: publishedAt.toISOString(),
      sentiment_score: parseFloat(faker.number.float({ min: -1.0, max: 1.0 }).toFixed(2)),
      entities_mentioned: [{ entity_type: 'POI', entity_value: faker.person.fullName() }],
      hashtags: ['security', 'alert'],
      geographic_tag: {
        latitude: associatedCase.latitude,
        longitude: associatedCase.longitude,
        location_name: faker.location.city()
      },
      associated_case_id: associatedCaseId
    };

    await dbHelper.app.datastore().table('osint_feed').insertRow(osintRecord);
    osintFeeds.push(osintRecord);
  }

  // Generate AI Case Summaries for all 250 cases
  console.log('Generating AI Case Summaries for 250 cases...');
  for (let i = 1; i <= totalCases; i++) {
    const c = casesInserted[i - 1];
    const summary = {
      summary_id: faker.string.uuid(),
      case_master_id: c.CaseMasterID,
      summary_text: `AI generated intelligence summary for case ${c.CrimeNo}. Modus operandi analyzed from brief facts.`,
      timeline_events: [
        {
          event_date: c.IncidentFromDate,
          event_type: 'Incident' as const,
          description: 'Crime occurred at the incident spot.'
        },
        {
          event_date: c.CrimeRegisteredDate,
          event_type: 'FIR Registration' as const,
          description: 'FIR registered at police station.'
        }
      ],
      identified_modus_operandi: faker.helpers.arrayElement(['Digital twin impersonation', 'Night burglary', 'Chain snatching on bike', 'Phishing via upi']),
      key_suspects: [
        {
          name: faker.person.fullName(),
          confidence_score: parseFloat(faker.number.float({ min: 0.5, max: 0.95 }).toFixed(2))
        }
      ],
      risk_factors: faker.helpers.arrayElements(['Repeat offender', 'High-density area', 'Flee risk'], 2),
      hotspot_ref: {
        latitude: c.latitude,
        longitude: c.longitude,
        radius_meters: faker.number.int({ min: 50, max: 500 })
      },
      patrol_recommendations: 'Increase night patrolling frequency around hotspot coordinates.',
      updated_at: new Date().toISOString()
    };

    await dbHelper.saveAICaseSummary(summary);
    aiSummaries.push(summary);
  }

  // Generate Digital Assets: 250 records
  console.log('Generating 250 Digital Assets...');
  for (let i = 1; i <= 250; i++) {
    const ownerId = faker.number.int({ min: 1, max: totalCriminals }).toString();
    const associatedCase = faker.helpers.arrayElement(casesInserted);
    const asset = {
      asset_id: faker.string.uuid(),
      asset_type: faker.helpers.arrayElement(['cctv_footage', 'phone_call_record', 'bank_statement']),
      owner_id: ownerId,
      owner_type: 'Accused',
      associated_case_id: associatedCase.CaseMasterID,
      metadata: {
        phone_number: faker.phone.number(),
        imei: faker.string.numeric(15),
        vehicle_reg: 'KA' + faker.string.numeric(2) + faker.string.alpha(2).toUpperCase() + faker.string.numeric(4),
        timestamp: new Date().toISOString()
      }
    };

    await dbHelper.app.datastore().table('digital_assets').insertRow(asset);
    digitalAssets.push(asset);
  }

  // --- 4. Write Mock Collections to JSON Files ---
  console.log('Writing mock collections to JSON files under backend/data/...');
  
  const osintPath = path.join(__dirname, '../data/osint_feed.json');
  const aiSummariesPath = path.join(__dirname, '../data/ai_case_summaries.json');
  const digitalAssetsPath = path.join(__dirname, '../data/digital_assets.json');

  fs.writeFileSync(osintPath, JSON.stringify(osintFeeds, null, 2), 'utf8');
  fs.writeFileSync(aiSummariesPath, JSON.stringify(aiSummaries, null, 2), 'utf8');
  fs.writeFileSync(digitalAssetsPath, JSON.stringify(digitalAssets, null, 2), 'utf8');

  console.log(`Simulation Seeding Complete!`);
  console.log(`Generated and successfully persisted to SQLite and JSON:
    - ${casesInserted.length} FIRs (CaseMaster)
    - ${accusedInserted.length} Criminals (Accused/PersonID pool of ${totalCriminals})
    - ${victimsInserted.length} Victims (Victim)
    - ${complainantsInserted.length} Complainants (ComplainantDetails)
    - ${totalArrests} Arrests (ArrestSurrender)
    - ${totalChargesheets} Chargesheets (ChargesheetDetails)
    - 100 OSINT records
    - 250 AI Case Summaries
    - 250 Digital Assets
  `);
}

seedSimulationData().catch((err) => {
  console.error('Seeder failed with error:', err);
  process.exit(1);
});
