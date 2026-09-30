-- SQLite Schema for Karnataka Police Crime Analytics Local Environment

PRAGMA foreign_keys = ON;

-- 1. Masters & Reference Tables

CREATE TABLE State (
    StateID INTEGER PRIMARY KEY,
    StateName TEXT NOT NULL,
    NationalityID INTEGER NOT NULL,
    Active INTEGER DEFAULT 1 -- 1 = True, 0 = False
);

CREATE TABLE District (
    DistrictID INTEGER PRIMARY KEY,
    DistrictName TEXT NOT NULL,
    StateID INTEGER NOT NULL,
    Active INTEGER DEFAULT 1,
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

CREATE TABLE UnitType (
    UnitTypeID INTEGER PRIMARY KEY,
    UnitTypeName TEXT NOT NULL,
    CityDistState TEXT NOT NULL,
    Hierarchy INTEGER NOT NULL,
    Active INTEGER DEFAULT 1
);

CREATE TABLE Unit (
    UnitID INTEGER PRIMARY KEY,
    UnitName TEXT NOT NULL,
    TypeID INTEGER NOT NULL,
    ParentUnit INTEGER,
    NationalityID INTEGER NOT NULL,
    StateID INTEGER NOT NULL,
    DistrictID INTEGER NOT NULL,
    Active INTEGER DEFAULT 1,
    FOREIGN KEY (TypeID) REFERENCES UnitType(UnitTypeID),
    FOREIGN KEY (ParentUnit) REFERENCES Unit(UnitID),
    FOREIGN KEY (StateID) REFERENCES State(StateID),
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID)
);

CREATE TABLE Rank (
    RankID INTEGER PRIMARY KEY,
    RankName TEXT NOT NULL,
    Hierarchy INTEGER NOT NULL,
    Active INTEGER DEFAULT 1
);

CREATE TABLE Designation (
    DesignationID INTEGER PRIMARY KEY,
    DesignationName TEXT NOT NULL,
    Active INTEGER DEFAULT 1,
    SortOrder INTEGER NOT NULL
);

CREATE TABLE Employee (
    EmployeeID INTEGER PRIMARY KEY,
    DistrictID INTEGER NOT NULL,
    UnitID INTEGER NOT NULL,
    RankID INTEGER NOT NULL,
    DesignationID INTEGER NOT NULL,
    KGID TEXT UNIQUE NOT NULL,
    FirstName TEXT NOT NULL,
    EmployeeDOB TEXT NOT NULL, -- ISO-8601 string
    GenderID INTEGER NOT NULL,
    BloodGroupID INTEGER NOT NULL,
    PhysicallyChallenged INTEGER DEFAULT 0,
    AppointmentDate TEXT NOT NULL, -- ISO-8601 string
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (RankID) REFERENCES Rank(RankID),
    FOREIGN KEY (DesignationID) REFERENCES Designation(DesignationID)
);

CREATE TABLE CaseCategory (
    CaseCategoryID INTEGER PRIMARY KEY,
    LookupValue TEXT NOT NULL
);

CREATE TABLE GravityOffence (
    GravityOffenceID INTEGER PRIMARY KEY,
    LookupValue TEXT NOT NULL
);

CREATE TABLE CrimeHead (
    CrimeHeadID INTEGER PRIMARY KEY,
    CrimeGroupName TEXT NOT NULL,
    Active INTEGER DEFAULT 1
);

CREATE TABLE CrimeSubHead (
    CrimeSubHeadID INTEGER PRIMARY KEY,
    CrimeHeadID INTEGER NOT NULL,
    CrimeHeadName TEXT NOT NULL,
    SeqID INTEGER NOT NULL,
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID)
);

CREATE TABLE CasteMaster (
    caste_master_id INTEGER PRIMARY KEY,
    caste_master_name TEXT NOT NULL
);

CREATE TABLE ReligionMaster (
    ReligionID INTEGER PRIMARY KEY,
    ReligionName TEXT NOT NULL
);

CREATE TABLE OccupationMaster (
    OccupationID INTEGER PRIMARY KEY,
    OccupationName TEXT NOT NULL
);

CREATE TABLE CaseStatusMaster (
    CaseStatusID INTEGER PRIMARY KEY,
    CaseStatusName TEXT NOT NULL
);

CREATE TABLE Court (
    CourtID INTEGER PRIMARY KEY,
    CourtName TEXT NOT NULL,
    DistrictID INTEGER NOT NULL,
    StateID INTEGER NOT NULL,
    Active INTEGER DEFAULT 1,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

-- 2. Legal Acts & Sections Reference

CREATE TABLE Act (
    ActCode TEXT PRIMARY KEY,
    ActDescription TEXT NOT NULL,
    ShortName TEXT NOT NULL,
    Active INTEGER DEFAULT 1
);

CREATE TABLE Section (
    ActCode TEXT NOT NULL,
    SectionCode TEXT NOT NULL,
    SectionDescription TEXT NOT NULL,
    Active INTEGER DEFAULT 1,
    PRIMARY KEY (ActCode, SectionCode),
    FOREIGN KEY (ActCode) REFERENCES Act(ActCode)
);

CREATE TABLE CrimeHeadActSection (
    CrimeHeadID INTEGER NOT NULL,
    ActCode TEXT NOT NULL,
    SectionCode TEXT NOT NULL,
    PRIMARY KEY (CrimeHeadID, ActCode, SectionCode),
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (ActCode, SectionCode) REFERENCES Section(ActCode, SectionCode)
);

-- 3. Core Case & Operations Tables

CREATE TABLE CaseMaster (
    CaseMasterID INTEGER PRIMARY KEY,
    CrimeNo TEXT UNIQUE NOT NULL,
    CaseNo TEXT NOT NULL,
    CrimeRegisteredDate TEXT NOT NULL, -- ISO-8601 string
    PolicePersonID INTEGER NOT NULL,
    PoliceStationID INTEGER NOT NULL,
    CaseCategoryID INTEGER NOT NULL,
    GravityOffenceID INTEGER NOT NULL,
    CrimeMajorHeadID INTEGER NOT NULL,
    CrimeMinorHeadID INTEGER NOT NULL,
    CaseStatusID INTEGER NOT NULL,
    CourtID INTEGER NOT NULL,
    IncidentFromDate TEXT NOT NULL, -- ISO-8601 string
    IncidentToDate TEXT NOT NULL,
    InfoReceivedPSDate TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    BriefFacts TEXT NOT NULL,
    FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID),
    FOREIGN KEY (CaseCategoryID) REFERENCES CaseCategory(CaseCategoryID),
    FOREIGN KEY (GravityOffenceID) REFERENCES GravityOffence(GravityOffenceID),
    FOREIGN KEY (CrimeMajorHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (CrimeMinorHeadID) REFERENCES CrimeSubHead(CrimeSubHeadID),
    FOREIGN KEY (CaseStatusID) REFERENCES CaseStatusMaster(CaseStatusID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID)
);

CREATE TABLE ComplainantDetails (
    ComplainantID INTEGER PRIMARY KEY,
    CaseMasterID INTEGER NOT NULL,
    ComplainantName TEXT NOT NULL,
    AgeYear INTEGER NOT NULL,
    OccupationID INTEGER NOT NULL,
    ReligionID INTEGER NOT NULL,
    CasteID INTEGER NOT NULL,
    GenderID INTEGER NOT NULL,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (OccupationID) REFERENCES OccupationMaster(OccupationID),
    FOREIGN KEY (ReligionID) REFERENCES ReligionMaster(ReligionID),
    FOREIGN KEY (CasteID) REFERENCES CasteMaster(caste_master_id)
);

CREATE TABLE ActSectionAssociation (
    CaseMasterID INTEGER NOT NULL,
    ActCode TEXT NOT NULL,
    SectionCode TEXT NOT NULL,
    ActOrderID INTEGER NOT NULL,
    SectionOrderID INTEGER NOT NULL,
    PRIMARY KEY (CaseMasterID, ActCode, SectionCode),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ActCode, SectionCode) REFERENCES Section(ActCode, SectionCode)
);

CREATE TABLE Victim (
    VictimMasterID INTEGER PRIMARY KEY,
    CaseMasterID INTEGER NOT NULL,
    VictimName TEXT NOT NULL,
    AgeYear INTEGER NOT NULL,
    GenderID INTEGER NOT NULL,
    VictimPolice TEXT NOT NULL, -- '1' or '0'
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE Accused (
    AccusedMasterID INTEGER PRIMARY KEY,
    CaseMasterID INTEGER NOT NULL,
    AccusedName TEXT NOT NULL,
    AgeYear INTEGER NOT NULL,
    GenderID INTEGER NOT NULL,
    PersonID TEXT NOT NULL, -- A1, A2, A3...
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE ArrestSurrender (
    ArrestSurrenderID INTEGER PRIMARY KEY,
    CaseMasterID INTEGER NOT NULL,
    ArrestSurrenderTypeID INTEGER NOT NULL,
    ArrestSurrenderDate TEXT NOT NULL, -- ISO-8601 string
    ArrestSurrenderStateId INTEGER NOT NULL,
    ArrestSurrenderDistrictId INTEGER NOT NULL,
    PoliceStationID INTEGER NOT NULL,
    IOID INTEGER NOT NULL,
    CourtID INTEGER NOT NULL,
    AccusedMasterID INTEGER NOT NULL,
    IsAccused INTEGER NOT NULL, -- 0 or 1
    IsComplainantAccused INTEGER NOT NULL, -- 0 or 1
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ArrestSurrenderStateId) REFERENCES State(StateID),
    FOREIGN KEY (ArrestSurrenderDistrictId) REFERENCES District(DistrictID),
    FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID),
    FOREIGN KEY (IOID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID),
    FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID)
);

CREATE TABLE inv_arrestsurrenderaccused (
    ArrestSurrenderID INTEGER NOT NULL,
    AccusedMasterID INTEGER NOT NULL,
    PRIMARY KEY (ArrestSurrenderID, AccusedMasterID),
    FOREIGN KEY (ArrestSurrenderID) REFERENCES ArrestSurrender(ArrestSurrenderID),
    FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID)
);

CREATE TABLE ChargesheetDetails (
    CSID INTEGER PRIMARY KEY,
    CaseMasterID INTEGER NOT NULL,
    csdate TEXT NOT NULL, -- ISO-8601 string
    cstype TEXT NOT NULL, -- 'A', 'B', 'C'
    PolicePersonID INTEGER NOT NULL,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID)
);

-- 4. NoSQL Mock Collections in SQLite (using TEXT columns with JSON type constraint check)

CREATE TABLE osint_feed (
    feed_id TEXT PRIMARY KEY,
    source_platform TEXT NOT NULL,
    publisher_name TEXT NOT NULL,
    content TEXT NOT NULL,
    published_at TEXT NOT NULL,
    sentiment_score REAL,
    entities_mentioned TEXT, -- JSON Array
    hashtags TEXT, -- JSON Array
    geographic_tag TEXT, -- JSON Object
    associated_case_id INTEGER,
    CHECK (json_valid(entities_mentioned) OR entities_mentioned IS NULL),
    CHECK (json_valid(hashtags) OR hashtags IS NULL),
    CHECK (json_valid(geographic_tag) OR geographic_tag IS NULL)
);

CREATE TABLE ai_case_summaries (
    summary_id TEXT PRIMARY KEY,
    case_master_id INTEGER UNIQUE NOT NULL,
    summary_text TEXT NOT NULL,
    timeline_events TEXT, -- JSON Array
    identified_modus_operandi TEXT,
    key_suspects TEXT, -- JSON Array
    risk_factors TEXT, -- JSON Array
    hotspot_ref TEXT, -- JSON Object
    patrol_recommendations TEXT,
    updated_at TEXT NOT NULL,
    CHECK (json_valid(timeline_events) OR timeline_events IS NULL),
    CHECK (json_valid(key_suspects) OR key_suspects IS NULL),
    CHECK (json_valid(risk_factors) OR risk_factors IS NULL),
    CHECK (json_valid(hotspot_ref) OR hotspot_ref IS NULL),
    FOREIGN KEY (case_master_id) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE digital_assets (
    asset_id TEXT PRIMARY KEY,
    asset_type TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    owner_type TEXT NOT NULL,
    associated_case_id INTEGER,
    metadata TEXT, -- JSON Object
    CHECK (json_valid(metadata) OR metadata IS NULL),
    FOREIGN KEY (associated_case_id) REFERENCES CaseMaster(CaseMasterID)
);

-- 5. Performance Indexes

CREATE UNIQUE INDEX IDX_CaseMaster_CrimeNo ON CaseMaster(CrimeNo);
CREATE INDEX IDX_CaseMaster_Dates ON CaseMaster(CrimeRegisteredDate, IncidentFromDate);
CREATE INDEX IDX_CaseMaster_Station ON CaseMaster(PoliceStationID);
CREATE INDEX IDX_CaseMaster_Status ON CaseMaster(CaseStatusID);
CREATE INDEX IDX_ArrestSurrender_Date ON ArrestSurrender(ArrestSurrenderDate);
CREATE UNIQUE INDEX IDX_Employee_KGID ON Employee(KGID);
