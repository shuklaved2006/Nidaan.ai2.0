"""
Module B: Rules-Backed Clinical Decision Support System (CDSS / Suggested Prescriptions)
Grounding in WHO Essential Medicines List (EML) & ICD-11 Diagnostic Guidelines
Clinical Safety & Maximum Dosage Overflow Fail-Safe Guardrails
"""
from datetime import datetime
from flask import Blueprint, request, jsonify, abort

cdss_bp = Blueprint('cdss', __name__)

# --- WHO EML & ICD-11 Rules Knowledge Base ---
WHO_EML_ICD11_KNOWLEDGE_BASE = {
    # Malaria (ICD-11: 1F40)
    "1F40": {
        "condition_name": "Plasmodium falciparum Malaria",
        "icd11_code": "1F40",
        "category": "Infectious Disease",
        "guidelines": "WHO Malaria Guidelines 2023 - Artemisinin-based combination therapy (ACT)",
        "suggested_medications": [
            {
                "drug_name": "Artemether + Lumefantrine",
                "atc_code": "P01BF01",
                "recommended_dosage": 80,
                "unit": "mg",
                "frequency": "Twice daily",
                "duration_days": 3,
                "max_daily_limit": 160,
                "notes": "Take with fatty food or milk to enhance bioavailability."
            },
            {
                "drug_name": "Paracetamol",
                "atc_code": "N02BE01",
                "recommended_dosage": 500,
                "unit": "mg",
                "frequency": "Every 6 hours as needed for fever",
                "duration_days": 3,
                "max_daily_limit": 4000,
                "notes": "Symptomatic fever management."
            }
        ]
    },
    # Essential Hypertension (ICD-11: BA00)
    "BA00": {
        "condition_name": "Essential Hypertension",
        "icd11_code": "BA00",
        "category": "Cardiovascular",
        "guidelines": "WHO Cardiovascular Guidelines - First Line Anti-hypertensive Therapy",
        "suggested_medications": [
            {
                "drug_name": "Amlodipine",
                "atc_code": "C08CA01",
                "recommended_dosage": 5,
                "unit": "mg",
                "frequency": "Once daily",
                "duration_days": 30,
                "max_daily_limit": 10,
                "notes": "Monitor blood pressure weekly."
            },
            {
                "drug_name": "Enalapril",
                "atc_code": "C09AA02",
                "recommended_dosage": 5,
                "unit": "mg",
                "frequency": "Once daily",
                "duration_days": 30,
                "max_daily_limit": 40,
                "notes": "Check serum potassium and renal function."
            }
        ]
    },
    # Acute Upper Respiratory Tract Infection (ICD-11: CA00)
    "CA00": {
        "condition_name": "Acute Upper Respiratory Tract Infection",
        "icd11_code": "CA00",
        "category": "Respiratory",
        "guidelines": "WHO EML Symptomatic Management Protocol",
        "suggested_medications": [
            {
                "drug_name": "Paracetamol",
                "atc_code": "N02BE01",
                "recommended_dosage": 500,
                "unit": "mg",
                "frequency": "Three times daily",
                "duration_days": 5,
                "max_daily_limit": 4000,
                "notes": "Do not exceed 4g daily."
            },
            {
                "drug_name": "Cetirizine",
                "atc_code": "R06AE07",
                "recommended_dosage": 10,
                "unit": "mg",
                "frequency": "Once daily at bedtime",
                "duration_days": 5,
                "max_daily_limit": 10,
                "notes": "May cause mild sedation."
            }
        ]
    },
    # Acute Gastroenteritis / Diarrheal Disease (ICD-11: 1A40)
    "1A40": {
        "condition_name": "Gastroenteritis of Infectious Origin",
        "icd11_code": "1A40",
        "category": "Gastrointestinal",
        "guidelines": "WHO Diarrheal Disease Management - ORS + Zinc Therapy",
        "suggested_medications": [
            {
                "drug_name": "Oral Rehydration Salts (ORS)",
                "atc_code": "A07CA01",
                "recommended_dosage": 1,
                "unit": "sachet (1L water)",
                "frequency": "After each loose stool",
                "duration_days": 3,
                "max_daily_limit": 4,
                "notes": "Primary rehydration therapy."
            },
            {
                "drug_name": "Zinc Sulfate",
                "atc_code": "A12CB01",
                "recommended_dosage": 20,
                "unit": "mg",
                "frequency": "Once daily",
                "duration_days": 10,
                "max_daily_limit": 20,
                "notes": "Reduces duration and severity of diarrheal episodes."
            }
        ]
    }
}

# --- Dosage Overflow Guardrail Checker ---

def check_dosage_safety(drug_name: str, dosage_val: float, unit: str, times_per_day: float, duration_days: int) -> dict:
    """
    Validates entered/suggested dosage against absolute safety limits.
    Triggers CRITICAL_DOSAGE_OVERFLOW_WARNING if exceeded.
    """
    daily_intake = dosage_val * times_per_day
    
    # Generic Safety Rule Dictionary (mg per day limits)
    SAFETY_BOUNDS = {
        "paracetamol": 4000.0,
        "acetaminophen": 4000.0,
        "amlodipine": 10.0,
        "enalapril": 40.0,
        "cetirizine": 10.0,
        "zinc sulfate": 50.0,
        "artemether + lumefantrine": 160.0,
        "amoxicillin": 3000.0,
        "ibuprofen": 2400.0
    }
    
    key = drug_name.lower().strip()
    max_safe = None
    for k, v in SAFETY_BOUNDS.items():
        if k in key:
            max_safe = v
            break
            
    if max_safe and daily_intake > max_safe:
        return {
            "safe": False,
            "warning_type": "CRITICAL_DOSAGE_OVERFLOW_WARNING",
            "message": f"CRITICAL DOSAGE WARNING: Prescribed daily intake of {drug_name} ({daily_intake} {unit}/day) exceeds the maximum safety threshold of {max_safe} {unit}/day.",
            "prescribed_daily": daily_intake,
            "max_safe_daily": max_safe,
            "requires_explicit_override": True
        }
        
    return {
        "safe": True,
        "warning_type": "NONE",
        "prescribed_daily": daily_intake,
        "requires_explicit_override": False
    }

# --- Endpoints for Module B ---

@cdss_bp.route('/api/v2/cdss/suggest-treatment', methods=['POST'])
def suggest_treatment():
    """
    Returns WHO EML & ICD-11 backed medication suggestions for doctor review.
    Human-in-the-loop: Doctor must explicitly sign off on prescription.
    """
    req = request.get_json() or {}
    icd11_code = req.get("icd11_code", "").upper().strip()
    symptoms = req.get("symptoms", [])
    
    # Match ICD-11 directly or fallback to keyword match
    protocol = WHO_EML_ICD11_KNOWLEDGE_BASE.get(icd11_code)
    
    if not protocol:
        # Search by symptoms / keyword
        symptom_str = " ".join(symptoms).lower()
        if "fever" in symptom_str or "malaria" in symptom_str:
            protocol = WHO_EML_ICD11_KNOWLEDGE_BASE["1F40"]
        elif "cough" in symptom_str or "cold" in symptom_str or "throat" in symptom_str:
            protocol = WHO_EML_ICD11_KNOWLEDGE_BASE["CA00"]
        elif "bp" in symptom_str or "hypertension" in symptom_str:
            protocol = WHO_EML_ICD11_KNOWLEDGE_BASE["BA00"]
        elif "diarrhea" in symptom_str or "vomiting" in symptom_str:
            protocol = WHO_EML_ICD11_KNOWLEDGE_BASE["1A40"]
        else:
            protocol = WHO_EML_ICD11_KNOWLEDGE_BASE["CA00"] # Safe default protocol
            
    return jsonify({
        "status": "SUCCESS",
        "human_in_loop_required": True,
        "disclaimer": "CDSS recommendations are draft guidelines derived from WHO EML. Treating physician must review and sign off.",
        "protocol": protocol
    }), 200


@cdss_bp.route('/api/v2/cdss/verify-dosage', methods=['POST'])
def verify_dosage():
    """Verifies prescription dosage safety against maximum daily limits."""
    req = request.get_json() or {}
    drug_name = req.get("drug_name", "")
    dosage_val = float(req.get("dosage", 0))
    unit = req.get("unit", "mg")
    times_per_day = float(req.get("times_per_day", 1))
    duration_days = int(req.get("duration_days", 1))
    
    safety_result = check_dosage_safety(drug_name, dosage_val, unit, times_per_day, duration_days)
    return jsonify(safety_result), 200


@cdss_bp.route('/api/v2/cdss/sign-prescription', methods=['POST'])
def sign_prescription():
    """
    Doctor explicit sign-off endpoint. Commits prescription to regional data store
    and feeds anonymized epidemiological matrix for regional inventory demand forecasting.
    """
    from app import require_role
    require_role(["Doctor", "Admin"], "sign clinical prescriptions")
    
    req = request.get_json() or {}
    doctor_signature = req.get("doctor_digital_signature")
    patient_id = req.get("patient_id")
    medications = req.get("medications", [])
    override_reason = req.get("override_reason")
    
    if not doctor_signature:
        return jsonify({"status": "ERROR", "message": "Doctor digital signature is mandatory to commit prescription."}), 400
        
    # Check for any dosage warnings needing explicit override reason
    for med in medications:
        safety = check_dosage_safety(
            med.get("drug_name", ""),
            float(med.get("dosage", 0)),
            med.get("unit", "mg"),
            float(med.get("times_per_day", 1)),
            int(med.get("duration_days", 1))
        )
        if not safety["safe"] and not override_reason:
            return jsonify({
                "status": "BLOCKED_DOSAGE_OVERFLOW",
                "message": safety["message"],
                "requires_override_reason": True
            }), 422

    # Save to regional DB via db_io helper if available
    import db_io
    data = db_io.get_data()
    prescriptions = data.get("prescriptions", [])
    
    signed_record = {
        "prescription_id": f"RX-{int(datetime.utcnow().timestamp())}",
        "patient_id": patient_id,
        "doctor_signature": doctor_signature,
        "medications": medications,
        "override_reason": override_reason,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "epidemiological_flagged": True
    }
    
    prescriptions.append(signed_record)
    data["prescriptions"] = prescriptions
    db_io.commit_data(data)
    
    return jsonify({
        "status": "PRESCRIPTION_SIGNED_COMMITTED",
        "prescription": signed_record
    }), 200
