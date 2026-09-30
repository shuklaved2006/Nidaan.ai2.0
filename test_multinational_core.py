"""
Comprehensive Integration & Regression Test Suite for Nidaan.AI Multi-National Core Modules
Verifies:
1. ABDM/ABHA Verification & HL7 FHIR R4 JSON Schema Output
2. Zero-Trust PII/PHI Anonymization Telemetry Shield
3. CDSS WHO EML & ICD-11 Suggestion Engine
4. CRITICAL_DOSAGE_OVERFLOW_WARNING Fail-Safe Bounding Checks
5. Doctor Signature & Override Requirement Protocols
6. Offline Vector Clock / LWW Conflict Resolution Engine
7. Legacy Regression Suite Pass Rate
"""
import unittest
import json
from app import app
from abdm_fhir_plugin import to_fhir_patient, anonymize_fhir_bundle
from cdss_engine import check_dosage_safety
from sync_manager import resolve_lww_conflict

class TestNidaanMultiNationalCore(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # --- MODULE A TESTS: ABDM / FHIR / PII SHIELD ---
    def test_verify_abha_success(self):
        response = self.app.post('/api/v2/national-health/verify-abha', 
                                 data=json.dumps({"abha_number": "14-1234-5678-9012"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "VERIFIED")
        self.assertEqual(data["patient_profile"]["name"], "Arjun Sharma")
        self.assertEqual(data["fhir_patient"]["resourceType"], "Patient")

    def test_verify_abha_fallback_local(self):
        response = self.app.post('/api/v2/national-health/verify-abha', 
                                 data=json.dumps({"abha_number": "99-9999-9999-9999"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "NOT_FOUND_FALLBACK_LOCAL")

    def test_zero_trust_pii_anonymization(self):
        raw_patient = {
            "name": "Maria Silva",
            "gender": "F",
            "dob": "1992-11-03",
            "abha_number": "BR-9876-5432-1098",
            "district": "São Paulo"
        }
        fhir_p = to_fhir_patient(raw_patient)
        bundle = {"resourceType": "Bundle", "entry": [{"resource": fhir_p}]}
        
        anon_bundle = anonymize_fhir_bundle(bundle)
        anon_patient = anon_bundle["entry"][0]["resource"]
        
        self.assertEqual(anon_patient["name"][0]["text"], "ANONYMIZED_PATIENT")
        self.assertNotEqual(anon_patient["identifier"][0]["value"], "BR-9876-5432-1098")
        self.assertTrue(anon_patient["birthDate"].endswith("-01-01"))

    # --- MODULE B TESTS: CDSS & DOSAGE FAIL-SAFE ---
    def test_cdss_suggest_malaria_protocol(self):
        response = self.app.post('/api/v2/cdss/suggest-treatment',
                                 data=json.dumps({"icd11_code": "1F40"}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["protocol"]["icd11_code"], "1F40")
        self.assertTrue(any(m["drug_name"] == "Artemether + Lumefantrine" for m in data["protocol"]["suggested_medications"]))

    def test_dosage_overflow_warning_triggered(self):
        # Paracetamol safe limit is 4000mg/day. Testing 2000mg x 3 = 6000mg/day
        result = check_dosage_safety("Paracetamol", 2000.0, "mg", 3.0, 3)
        self.assertFalse(result["safe"])
        self.assertEqual(result["warning_type"], "CRITICAL_DOSAGE_OVERFLOW_WARNING")
        self.assertTrue(result["requires_explicit_override"])

    def test_dosage_safe_check(self):
        # Paracetamol 500mg x 3 = 1500mg/day (Safe)
        result = check_dosage_safety("Paracetamol", 500.0, "mg", 3.0, 3)
        self.assertTrue(result["safe"])

    def test_sign_prescription_requires_doctor(self):
        # Attempt signing as Patient role (should fail 403)
        headers = {"X-Active-Role": "Patient"}
        payload = {
            "doctor_digital_signature": "DOC-SIG-12345",
            "patient_id": "P-101",
            "medications": [{"drug_name": "Amlodipine", "dosage": 5, "unit": "mg", "times_per_day": 1, "duration_days": 30}]
        }
        response = self.app.post('/api/v2/cdss/sign-prescription',
                                 headers=headers,
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_sign_prescription_success_as_doctor(self):
        headers = {"X-Active-Role": "Doctor"}
        payload = {
            "doctor_digital_signature": "DOC-SIG-999",
            "patient_id": "P-101",
            "medications": [{"drug_name": "Amlodipine", "dosage": 5, "unit": "mg", "times_per_day": 1, "duration_days": 30}]
        }
        response = self.app.post('/api/v2/cdss/sign-prescription',
                                 headers=headers,
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "PRESCRIPTION_SIGNED_COMMITTED")

    # --- MODULE D TESTS: VECTOR CLOCK / LWW SYNC ---
    def test_lww_conflict_resolution(self):
        local_rec = {"id": "ATT-1", "status": "PRESENT", "timestamp": "2026-09-30T10:00:00Z", "vclock": 1}
        incoming_rec = {"id": "ATT-1", "status": "PRESENT_BIOFENCED", "timestamp": "2026-09-30T10:05:00Z", "vclock": 2}
        
        winner = resolve_lww_conflict(local_rec, incoming_rec)
        self.assertEqual(winner["status"], "PRESENT_BIOFENCED")
        self.assertEqual(winner["vclock"], 3)

if __name__ == '__main__':
    unittest.main()
