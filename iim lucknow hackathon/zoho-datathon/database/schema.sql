-- SQL Schema Specification for Karnataka Police Crime Analytics
-- Target: Zoho Catalyst Data Store / Relational Database System

-- 1. Masters & Reference Tables

CREATE TABLE State (
    StateID INT PRIMARY KEY,
    StateName VARCHAR(100) NOT NULL,
    NationalityID INT NOT NULL,
    Active BIT DEFAULT 1
);

CREATE TABLE District (
    DistrictID INT PRIMARY KEY,
    DistrictName VARCHAR(100) NOT NULL,
    StateID INT NOT NULL,
    Active BIT DEFAULT 1,
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

CREATE TABLE UnitType (
    UnitTypeID INT PRIMARY KEY,
    UnitTypeName VARCHAR(100) NOT NULL,
    CityDistState VARCHAR(50) NOT NULL,
    Hierarchy INT NOT NULL,
    Active BIT DEFAULT 1
);

CREATE TABLE Unit (
    UnitID INT PRIMARY KEY,
    UnitName VARCHAR(150) NOT NULL,
    TypeID INT NOT NULL,
    ParentUnit INT NULL,
    NationalityID INT NOT NULL,
    StateID INT NOT NULL,
    DistrictID INT NOT NULL,
    Active BIT DEFAULT 1,
    FOREIGN KEY (TypeID) REFERENCES UnitType(UnitTypeID),
    FOREIGN KEY (ParentUnit) REFERENCES Unit(UnitID),
    FOREIGN KEY (StateID) REFERENCES State(StateID),
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID)
);

CREATE TABLE Rank (
    RankID INT PRIMARY KEY,
    RankName VARCHAR(100) NOT NULL,
    Hierarchy INT NOT NULL,
    Active BIT DEFAULT 1
);

CREATE TABLE Designation (
    DesignationID INT PRIMARY KEY,
    DesignationName VARCHAR(100) NOT NULL,
    Active BIT DEFAULT 1,
    SortOrder INT NOT NULL
);

CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    DistrictID INT NOT NULL,
    UnitID INT NOT NULL,
    RankID INT NOT NULL,
    DesignationID INT NOT NULL,
    KGID VARCHAR(50) UNIQUE NOT NULL,
    FirstName VARCHAR(150) NOT NULL,
    EmployeeDOB DATE NOT NULL,
    GenderID INT NOT NULL,
    BloodGroupID INT NOT NULL,
    PhysicallyChallenged BIT DEFAULT 0,
    AppointmentDate DATE NOT NULL,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (RankID) REFERENCES Rank(RankID),
    FOREIGN KEY (DesignationID) REFERENCES Designation(DesignationID)
);

CREATE TABLE CaseCategory (
    CaseCategoryID INT PRIMARY KEY,
    LookupValue VARCHAR(50) NOT NULL -- e.g., FIR, UDR, Zero FIR, PAR
);

CREATE TABLE GravityOffence (
    GravityOffenceID INT PRIMARY KEY,
    LookupValue VARCHAR(50) NOT NULL -- e.g., Heinous, Non-Heinous
);

CREATE TABLE CrimeHead (
    CrimeHeadID INT PRIMARY KEY,
    CrimeGroupName VARCHAR(100) NOT NULL, -- e.g., Property Crime, Cyber Crime
    Active BIT DEFAULT 1
);

CREATE TABLE CrimeSubHead (
    CrimeSubHeadID INT PRIMARY KEY,
    CrimeHeadID INT NOT NULL,
    CrimeHeadName VARCHAR(100) NOT NULL, -- e.g., Vehicle Theft, Cyber Fraud
    SeqID INT NOT NULL,
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID)
);

CREATE TABLE CasteMaster (
    caste_master_id INT PRIMARY KEY,
    caste_master_name VARCHAR(100) NOT NULL
);

CREATE TABLE ReligionMaster (
    ReligionID INT PRIMARY KEY,
    ReligionName VARCHAR(100) NOT NULL
);

CREATE TABLE OccupationMaster (
    OccupationID INT PRIMARY KEY,
    OccupationName VARCHAR(100) NOT NULL
);

CREATE TABLE CaseStatusMaster (
    CaseStatusID INT PRIMARY KEY,
    CaseStatusName VARCHAR(100) NOT NULL -- e.g., Under Investigation, Charge Sheeted, Closed
);

CREATE TABLE Court (
    CourtID INT PRIMARY KEY,
    CourtName VARCHAR(200) NOT NULL,
    DistrictID INT NOT NULL,
    StateID INT NOT NULL,
    Active BIT DEFAULT 1,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

-- 2. Legal Acts & Sections Reference

CREATE TABLE Act (
    ActCode VARCHAR(50) PRIMARY KEY, -- e.g., IPC, NDPS, IT_ACT
    ActDescription VARCHAR(500) NOT NULL,
    ShortName VARCHAR(100) NOT NULL,
    Active BIT DEFAULT 1
);

CREATE TABLE Section (
    ActCode VARCHAR(50) NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    SectionDescription VARCHAR(500) NOT NULL,
    Active BIT DEFAULT 1,
    PRIMARY KEY (ActCode, SectionCode),
    FOREIGN KEY (ActCode) REFERENCES Act(ActCode)
);

CREATE TABLE CrimeHeadActSection (
    CrimeHeadID INT NOT NULL,
    ActCode VARCHAR(50) NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    PRIMARY KEY (CrimeHeadID, ActCode, SectionCode),
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (ActCode, SectionCode) REFERENCES Section(ActCode, SectionCode)
);

-- 3. Core Case & Operations Tables

CREATE TABLE CaseMaster (
    CaseMasterID INT PRIMARY KEY,
    CrimeNo VARCHAR(50) UNIQUE NOT NULL, -- Format: Category(1) + District(4) + Station(4) + Year(4) + Serial(5)
    CaseNo VARCHAR(20) NOT NULL,        -- Format: YYYY + Serial(5) (Last 9 digits of CrimeNo)
    CrimeRegisteredDate DATE NOT NULL,
    PolicePersonID INT NOT NULL,         -- Officer who registered the FIR
    PoliceStationID INT NOT NULL,        -- Station (Unit) where registered
    CaseCategoryID INT NOT NULL,
    GravityOffenceID INT NOT NULL,
    CrimeMajorHeadID INT NOT NULL,
    CrimeMinorHeadID INT NOT NULL,
    CaseStatusID INT NOT NULL,
    CourtID INT NOT NULL,
    IncidentFromDate DATETIME NOT NULL,
    IncidentToDate DATETIME NOT NULL,
    InfoReceivedPSDate DATETIME NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    BriefFacts NVARCHAR(MAX) NOT NULL,
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
    ComplainantID INT PRIMARY KEY,
    CaseMasterID INT NOT NULL,
    ComplainantName VARCHAR(200) NOT NULL,
    AgeYear INT NOT NULL,
    OccupationID INT NOT NULL,
    ReligionID INT NOT NULL,
    CasteID INT NOT NULL,
    GenderID INT NOT NULL, -- Lookup value: 1=M, 2=F, 3=T etc.
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (OccupationID) REFERENCES OccupationMaster(OccupationID),
    FOREIGN KEY (ReligionID) REFERENCES ReligionMaster(ReligionID),
    FOREIGN KEY (CasteID) REFERENCES CasteMaster(caste_master_id)
);

CREATE TABLE ActSectionAssociation (
    CaseMasterID INT NOT NULL,
    ActCode VARCHAR(50) NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    ActOrderID INT NOT NULL,
    SectionOrderID INT NOT NULL,
    PRIMARY KEY (CaseMasterID, ActCode, SectionCode),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ActCode, SectionCode) REFERENCES Section(ActCode, SectionCode)
);

CREATE TABLE Victim (
    VictimMasterID INT PRIMARY KEY,
    CaseMasterID INT NOT NULL,
    VictimName VARCHAR(200) NOT NULL,
    AgeYear INT NOT NULL,
    GenderID INT NOT NULL, -- Lookup value: 1=M, 2=F, 3=T etc.
    VictimPolice VARCHAR(1) NOT NULL, -- '1' if police officer, '0' otherwise
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE Accused (
    AccusedMasterID INT PRIMARY KEY,
    CaseMasterID INT NOT NULL,
    AccusedName VARCHAR(200) NOT NULL,
    AgeYear INT NOT NULL,
    GenderID INT NOT NULL, -- Lookup value: 1=M, 2=F, 3=T etc.
    PersonID VARCHAR(10) NOT NULL, -- Sorting identifier like A1, A2, A3...
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

CREATE TABLE ArrestSurrender (
    ArrestSurrenderID INT PRIMARY KEY,
    CaseMasterID INT NOT NULL,
    ArrestSurrenderTypeID INT NOT NULL, -- Lookup value: 1=Arrest, 2=Surrender
    ArrestSurrenderDate DATE NOT NULL,
    ArrestSurrenderStateId INT NOT NULL,
    ArrestSurrenderDistrictId INT NOT NULL,
    PoliceStationID INT NOT NULL,
    IOID INT NOT NULL, -- Investigating Officer ID
    CourtID INT NOT NULL,
    AccusedMasterID INT NOT NULL,
    IsAccused BIT NOT NULL,
    IsComplainantAccused BIT NOT NULL,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ArrestSurrenderStateId) REFERENCES State(StateID),
    FOREIGN KEY (ArrestSurrenderDistrictId) REFERENCES District(DistrictID),
    FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID),
    FOREIGN KEY (IOID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID),
    FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID)
);

CREATE TABLE inv_arrestsurrenderaccused (
    ArrestSurrenderID INT NOT NULL,
    AccusedMasterID INT NOT NULL,
    PRIMARY KEY (ArrestSurrenderID, AccusedMasterID),
    FOREIGN KEY (ArrestSurrenderID) REFERENCES ArrestSurrender(ArrestSurrenderID),
    FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID)
);

CREATE TABLE ChargesheetDetails (
    CSID INT PRIMARY KEY,
    CaseMasterID INT NOT NULL,
    csdate DATETIME NOT NULL,
    cstype CHAR(1) NOT NULL, -- 'A' -> Chargesheet, 'B' -> False Case, 'C' -> Undetected
    PolicePersonID INT NOT NULL, -- Officer submitting chargesheet
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID)
);

-- 4. Essential Indexes for Query Performance

CREATE INDEX IDX_CaseMaster_CrimeNo ON CaseMaster(CrimeNo);
CREATE INDEX IDX_CaseMaster_Dates ON CaseMaster(CrimeRegisteredDate, IncidentFromDate);
CREATE INDEX IDX_CaseMaster_Station ON CaseMaster(PoliceStationID);
CREATE INDEX IDX_CaseMaster_Status ON CaseMaster(CaseStatusID);
CREATE INDEX IDX_ArrestSurrender_Date ON ArrestSurrender(ArrestSurrenderDate);
CREATE INDEX INDEX_Employee_KGID ON Employee(KGID);
