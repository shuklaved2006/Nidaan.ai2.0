// Database models for Karnataka Police Crime Analytics Platform
// Maps Zoho Catalyst Data Store schemas and auxiliary NoSQL structures

// ==========================================
// 1. Relational Table Models (Catalyst Data Store)
// ==========================================

export interface State {
  StateID: number;
  StateName: string;
  NationalityID: number;
  Active: boolean;
}

export interface District {
  DistrictID: number;
  DistrictName: string;
  StateID: number;
  Active: boolean;
}

export interface UnitType {
  UnitTypeID: number;
  UnitTypeName: string;
  CityDistState: string;
  Hierarchy: number;
  Active: boolean;
}

export interface Unit {
  UnitID: number;
  UnitName: string;
  TypeID: number;
  ParentUnit?: number | null;
  NationalityID: number;
  StateID: number;
  DistrictID: number;
  Active: boolean;
}

export interface Rank {
  RankID: number;
  RankName: string;
  Hierarchy: number;
  Active: boolean;
}

export interface Designation {
  DesignationID: number;
  DesignationName: string;
  Active: boolean;
  SortOrder: number;
}

export interface Employee {
  EmployeeID: number;
  DistrictID: number;
  UnitID: number;
  RankID: number;
  DesignationID: number;
  KGID: string; // Karnataka Government ID (unique)
  FirstName: string;
  EmployeeDOB: Date | string; // ISO date string
  GenderID: number;
  BloodGroupID: number;
  PhysicallyChallenged: boolean;
  AppointmentDate: Date | string;
}

export interface CaseCategory {
  CaseCategoryID: number;
  LookupValue: 'FIR' | 'UDR' | 'Zero FIR' | 'PAR' | string;
}

export interface GravityOffence {
  GravityOffenceID: number;
  LookupValue: 'Heinous' | 'Non-Heinous' | string;
}

export interface CrimeHead {
  CrimeHeadID: number;
  CrimeGroupName: string; // e.g., Property Crime, Cyber Crime
  Active: boolean;
}

export interface CrimeSubHead {
  CrimeSubHeadID: number;
  CrimeHeadID: number;
  CrimeHeadName: string;
  SeqID: number;
}

export interface CasteMaster {
  caste_master_id: number;
  caste_master_name: string;
}

export interface ReligionMaster {
  ReligionID: number;
  ReligionName: string;
}

export interface OccupationMaster {
  OccupationID: number;
  OccupationName: string;
}

export interface CaseStatusMaster {
  CaseStatusID: number;
  CaseStatusName: 'Under Investigation' | 'Charge Sheeted' | 'Closed' | string;
}

export interface Court {
  CourtID: number;
  CourtName: string;
  DistrictID: number;
  StateID: number;
  Active: boolean;
}

export interface Act {
  ActCode: string; // e.g., 'IPC', 'NDPS'
  ActDescription: string;
  ShortName: string;
  Active: boolean;
}

export interface Section {
  ActCode: string;
  SectionCode: string; // e.g., '302', '379'
  SectionDescription: string;
  Active: boolean;
}

export interface CrimeHeadActSection {
  CrimeHeadID: number;
  ActCode: string;
  SectionCode: string;
}

export interface CaseMaster {
  CaseMasterID: number;
  CrimeNo: string; // structured: category + district + station + year + serial
  CaseNo: string;  // YYYY + serial
  CrimeRegisteredDate: Date | string;
  PolicePersonID: number;  // EmployeeID
  PoliceStationID: number; // UnitID
  CaseCategoryID: number;
  GravityOffenceID: number;
  CrimeMajorHeadID: number;
  CrimeMinorHeadID: number;
  CaseStatusID: number;
  CourtID: number;
  IncidentFromDate: Date | string;
  IncidentToDate: Date | string;
  InfoReceivedPSDate: Date | string;
  latitude: number;
  longitude: number;
  BriefFacts: string;
}

export interface ComplainantDetails {
  ComplainantID: number;
  CaseMasterID: number;
  ComplainantName: string;
  AgeYear: number;
  OccupationID: number;
  ReligionID: number;
  CasteID: number;
  GenderID: number;
}

export interface ActSectionAssociation {
  CaseMasterID: number;
  ActCode: string;
  SectionCode: string;
  ActOrderID: number;
  SectionOrderID: number;
}

export interface Victim {
  VictimMasterID: number;
  CaseMasterID: number;
  VictimName: string;
  AgeYear: number;
  GenderID: number;
  VictimPolice: '1' | '0' | string; // '1' = police, '0' = citizen
}

export interface Accused {
  AccusedMasterID: number;
  CaseMasterID: number;
  AccusedName: string;
  AgeYear: number;
  GenderID: number;
  PersonID: string; // A1, A2, A3...
}

export interface ArrestSurrender {
  ArrestSurrenderID: number;
  CaseMasterID: number;
  ArrestSurrenderTypeID: number; // 1 = Arrest, 2 = Surrender
  ArrestSurrenderDate: Date | string;
  ArrestSurrenderStateId: number;
  ArrestSurrenderDistrictId: number;
  PoliceStationID: number;
  IOID: number; // EmployeeID
  CourtID: number;
  AccusedMasterID: number;
  IsAccused: boolean;
  IsComplainantAccused: boolean;
}

export interface InvArrestSurrenderAccused {
  ArrestSurrenderID: number;
  AccusedMasterID: number;
}

export interface ChargesheetDetails {
  CSID: number;
  CaseMasterID: number;
  csdate: Date | string;
  cstype: 'A' | 'B' | 'C' | string; // 'A' = Chargesheet, 'B' = False, 'C' = Undetected
  PolicePersonID: number; // EmployeeID
}

// ==========================================
// 2. Auxiliary NoSQL Collections Models
// ==========================================

export interface OSINTFeed {
  feed_id: string;
  source_platform: 'X' | 'Instagram' | 'News' | 'Community Forum';
  publisher_name: string;
  content: string;
  published_at: Date | string;
  sentiment_score?: number; // range -1.0 to 1.0
  entities_mentioned?: Array<{
    entity_type: 'Accused' | 'Victim' | 'POI' | 'Location' | 'Vehicle' | 'Phone' | 'Bank_Account' | 'UPI_ID';
    entity_value: string;
    entity_id?: string | number | null; // Resolved database ID
  }>;
  hashtags?: string[];
  geographic_tag?: {
    latitude: number;
    longitude: number;
    location_name?: string;
  };
  associated_case_id?: number | null;
}

export interface AICaseSummary {
  summary_id: string;
  case_master_id: number;
  summary_text: string;
  timeline_events?: Array<{
    event_date: Date | string;
    event_type: 'Incident' | 'FIR Registration' | 'Investigation Update' | 'Arrest' | 'Chargesheet Filed' | 'Court Hearing';
    description: string;
    officer_in_charge?: string;
  }>;
  identified_modus_operandi?: string;
  key_suspects?: Array<{
    name: string;
    accused_id?: number;
    role?: string;
    confidence_score?: number; // 0.0 to 1.0
  }>;
  risk_factors?: string[];
  hotspot_ref?: {
    latitude: number;
    longitude: number;
    radius_meters: number;
  };
  patrol_recommendations?: string;
  updated_at: Date | string;
}

export interface DigitalAsset {
  asset_id: string;
  asset_type: 'cctv_footage' | 'phone_call_record' | 'bank_statement' | 'upi_transaction' | 'email_log' | 'social_profile';
  owner_id: string; // Identifier of owner (AccusedMasterID, VictimMasterID, POI name, or Business ID)
  owner_type: 'Accused' | 'Victim' | 'POI' | 'Business' | 'Officer';
  associated_case_id?: number | null;
  metadata?: {
    phone_number?: string;
    bank_account_no?: string;
    upi_id?: string;
    email_address?: string;
    ip_address?: string;
    imei?: string;
    cctv_location?: string;
    timestamp?: Date | string;
    duration_seconds?: number;
    transaction_amount?: number;
    recipient_details?: string;
    [key: string]: any;
  };
}
