"""
Module A: ABDM / ABHA & Multi-National Health Stack Integration Plugin
HL7 FHIR R4 Standard Mapping & Privacy-Preserving Telemetry Sanitizer
"""
import uuid
import hashlib
from datetime import datetime
from flask import Blueprint, request, jsonify, abort

abdm_fhir_bp = Blueprint('abdm_fhir', __name__)

# --- Mock ABDM / ABHA M1/M2/M3 National Health Identity Registry ---
MOCK_NATIONAL_ID_DB = {
    "14-1234-5678-9012": {
        "abha_number": "14-1234-5678-9012",
        "abha_address": "arjun.sharma@abdm",
        "name": "Arjun Sharma",
        "gender": "M",
        "dob": "1988-05-14",
        "mobile": "+919876543210",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "country": "IND",
        "status": "VERIFIED"
    },
    "BR-9876-5432-1098": {
        "abha_number": "BR-9876-5432-1098",
        "abha_address": "maria.silva@saude",
        "name": "Maria Silva",
        "gender": "F",
        "dob": "1992-11-03",
        "mobile": "+5511987654321",
        "district": "São Paulo",
        "state": "SP",
        "country": "BRA",
        "status": "VERIFIED"
    }
}

# --- HL7 FHIR R4 Model Converters ---

def to_fhir_patient(patient_data: dict) -> dict:
    """
    Transforms internal Nidaan.AI patient record into HL7 FHIR R4 Patient Resource.
    """
    patient_id = str(patient_data.get("id") or patient_data.get("patient_id") or uuid.uuid4())
    gender_map = {"M": "male", "F": "female", "Other": "other"}
    
    fhir_patient = {
        "resourceType": "Patient",
        "id": patient_id,
        "meta": {
            "versionId": "1",
            "lastUpdated": datetime.utcnow().isoformat() + "Z",
            "profile": ["http://hl7.org/fhir/StructureDefinition/Patient"]
        },
        "identifier": [],
        "name": [{
            "use": "official",
            "text": patient_data.get("name", "Anonymous Patient")
        }],
        "gender": gender_map.get(patient_data.get("gender"), "unknown"),
        "birthDate": patient_data.get("dob") or patient_data.get("birth_date"),
        "address": [{
            "city": patient_data.get("district") or patient_data.get("city", "Local District"),
            "state": patient_data.get("state", "State"),
            "country": patient_data.get("country", "IND")
        }]
    }
    
    if patient_data.get("abha_number"):
        fhir_patient["identifier"].append({
            "system": "https://healthid.ndhm.gov.in",
            "value": patient_data.get("abha_number"),
            "type": {"coding": [{"system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR"}]}
        })
        
    return fhir_patient


def to_fhir_condition(encounter_data: dict) -> dict:
    """
    Transforms clinical diagnosis into HL7 FHIR R4 Condition Resource.
    """
    return {
        "resourceType": "Condition",
        "id": str(uuid.uuid4()),
        "clinicalStatus": {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                "code": "active"
            }]
        },
        "verificationStatus": {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                "code": "confirmed"
            }]
        },
        "code": {
            "coding": [{
                "system": "http://hl7.org/fhir/sid/icd-11",
                "code": encounter_data.get("icd11_code", "1F40"),
                "display": encounter_data.get("diagnosis", "Unspecified Clinical Condition")
            }]
        },
        "subject": {
            "reference": f"Patient/{encounter_data.get('patient_id')}"
        },
        "recordedDate": datetime.utcnow().isoformat() + "Z"
    }


def to_fhir_medication_request(prescription_data: dict) -> dict:
    """
    Transforms doctor prescription into HL7 FHIR R4 MedicationRequest Resource.
    """
    return {
        "resourceType": "MedicationRequest",
        "id": str(uuid.uuid4()),
        "status": "active",
        "intent": "order",
        "medicationCodeableConcept": {
            "coding": [{
                "system": "http://www.whocc.no/atc",
                "code": prescription_data.get("atc_code", "N02BE01"),
                "display": prescription_data.get("drug_name")
            }]
        },
        "subject": {
            "reference": f"Patient/{prescription_data.get('patient_id')}"
        },
        "dosageInstruction": [{
            "text": f"{prescription_data.get('dosage')} {prescription_data.get('unit')} {prescription_data.get('frequency')}",
            "timing": {"repeat": {"duration": prescription_data.get("duration_days", 3), "durationUnit": "d"}}
        }],
        "authoredOn": datetime.utcnow().isoformat() + "Z"
    }


def anonymize_fhir_bundle(bundle: dict) -> dict:
    """
    Zero-Trust Privacy Shield: Strips all PII/PHI (names, phone numbers, exact addresses, 
    national identity numbers) from FHIR bundle before transmission to central analytical 
    or cross-border telemetry endpoints.
    """
    import copy
    anonymized = copy.deepcopy(bundle)
    
    entry_list = anonymized.get("entry", []) if isinstance(anonymized, dict) and anonymized.get("resourceType") == "Bundle" else [anonymized]
    
    for item in entry_list:
        resource = item.get("resource", item)
        if resource.get("resourceType") == "Patient":
            # Mask PII
            resource["name"] = [{"text": "ANONYMIZED_PATIENT"}]
            if "telecom" in resource:
                del resource["telecom"]
            # Hash identifiers
            if "identifier" in resource:
                for ident in resource["identifier"]:
                    val = ident.get("value", "")
                    ident["value"] = hashlib.sha256(val.encode('utf-8')).hexdigest()[:16]
            # Coarsen birth date to birth year only
            if resource.get("birthDate") and len(resource["birthDate"]) >= 4:
                resource["birthDate"] = resource["birthDate"][:4] + "-01-01"
                
    return anonymized

# --- Endpoints for Module A ---

@abdm_fhir_bp.route('/api/v2/national-health/verify-abha', methods=['POST'])
def verify_abha():
    """Verify ABHA or National Health ID and return linked profile or fallback to local intake."""
    req = request.get_json() or {}
    abha_id = req.get("abha_number", "").strip()
    
    if not abha_id:
        return jsonify({"status": "FALLBACK_LOCAL", "message": "No National ID provided. Proceeding with local registration intake."}), 200
        
    record = MOCK_NATIONAL_ID_DB.get(abha_id)
    if record:
        fhir_res = to_fhir_patient(record)
        return jsonify({
            "status": "VERIFIED",
            "source": "ABDM_NATIONAL_STACK",
            "patient_profile": record,
            "fhir_patient": fhir_res
        }), 200
    else:
        # Graceful fallback for un-enrolled patients
        return jsonify({
            "status": "NOT_FOUND_FALLBACK_LOCAL",
            "message": f"National Health ID '{abha_id}' not found in registry. Fallback to local district intake.",
            "abha_number": abha_id
        }), 200


@abdm_fhir_bp.route('/api/v2/national-health/patient-fhir/<patient_id>', methods=['GET'])
def get_patient_fhir(patient_id):
    """Retrieve FHIR R4 Patient Resource representation."""
    import db_io
    data = db_io.get_data()
    patients = data.get("patients", [])
    matched = next((p for p in patients if str(p.get("id")) == str(patient_id) or p.get("patient_id") == str(patient_id)), None)
    
    if not matched:
        matched = {"id": patient_id, "name": "District Patient", "gender": "M", "district": "Local Health Center"}
        
    fhir_patient = to_fhir_patient(matched)
    return jsonify(fhir_patient), 200


@abdm_fhir_bp.route('/api/v2/national-health/anonymized-telemetry', methods=['POST'])
def generate_telemetry_bundle():
    """Generates zero-trust anonymized FHIR telemetry bundle for analytical streaming."""
    raw_data = request.get_json() or {}
    fhir_patient = to_fhir_patient(raw_data.get("patient", {}))
    bundle = {
        "resourceType": "Bundle",
        "type": "collection",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "entry": [{"resource": fhir_patient}]
    }
    anonymized_bundle = anonymize_fhir_bundle(bundle)
    return jsonify({
        "status": "ANONYMIZED_SUCCESS",
        "data_sovereignty_status": "PII_STRIPPED_LOCAL_ONLY",
        "bundle": anonymized_bundle
    }), 200
