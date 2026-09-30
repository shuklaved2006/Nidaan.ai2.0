import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether

pdf_path = r"C:\Users\hello\Documents\antigravity\splendid-davinci\Nidaan_AI_System_Manifesto.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
)

styles = getSampleStyleSheet()

# Custom color palette
NAVY = colors.HexColor("#0A2540")
TEAL = colors.HexColor("#00D4B2")
DARK_GRAY = colors.HexColor("#2C3E50")
LIGHT_BG = colors.HexColor("#F8FAFC")
BORDER_COLOR = colors.HexColor("#E2E8F0")

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=NAVY,
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=TEAL,
    spaceAfter=15
)

h1_style = ParagraphStyle(
    'H1',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=NAVY,
    spaceBefore=14,
    spaceAfter=8
)

h2_style = ParagraphStyle(
    'H2',
    parent=styles['Heading3'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=DARK_GRAY,
    spaceBefore=8,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=DARK_GRAY,
    spaceAfter=6
)

bullet_style = ParagraphStyle(
    'Bullet',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=DARK_GRAY,
    leftIndent=12,
    spaceAfter=4
)

table_header_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=11,
    textColor=colors.white
)

table_body_style = ParagraphStyle(
    'TableBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11.5,
    textColor=DARK_GRAY
)

elements = []

# Title & Metadata Header
elements.append(Paragraph("SYSTEM MANIFESTO: NIDAAN.AI", title_style))
elements.append(Paragraph("FEDERATED MULTI-NATIONAL CLINICAL CORE & OPERATIONS ENGINE", subtitle_style))
elements.append(HRFlowable(width="100%", thickness=2, color=NAVY, spaceAfter=12))

# Executive Summary
elements.append(Paragraph("Executive Summary & Core Philosophy", h1_style))
summary_text = (
    "<b>Nidaan.AI</b> is a zero-downtime, offline-first, multi-country health stack engineered to connect "
    "Primary Healthcare Centers (PHC) and Community Healthcare Centers (CHC) with regional command centers and "
    "national health identity frameworks (such as India's ABDM / ABHA stack). The platform is governed by three non-negotiable architectural principles:<br/><br/>"
    "1. <b>Zero Cross-Border PHI Leaks:</b> Patient Identifiers (PII/PHI) are strictly isolated within local regional nodes. Central telemetry streams receive cryptographically anonymized data bundles.<br/>"
    "2. <b>Clinical Safety First (Human-in-the-Loop CDSS):</b> AI and rules engines provide standardized draft recommendations, but licensed treating physicians retain sole sign-off authority.<br/>"
    "3. <b>Resilience & Offline Autonomy:</b> All clinical check-ins, stock deductions, and bed updates function seamlessly offline, reconciling upon reconnection using Vector Clocks and Last-Write-Wins (LWW) conflict resolution."
)
elements.append(Paragraph(summary_text, body_style))
elements.append(Spacer(1, 10))

# Stakeholders & Terminals Table
elements.append(Paragraph("1. Target Stakeholders & Dedicated User Terminals", h1_style))

stakeholder_data = [
    [Paragraph("Target Stakeholder", table_header_style), Paragraph("Dedicated Interface Terminal", table_header_style), Paragraph("Core System Objective", table_header_style)],
    [Paragraph("<b>Patients & Citizens</b>", table_body_style), Paragraph("Public Patient Portal", table_body_style), Paragraph("Transparent directory access, live bed availability, diagnostic search & ABHA registration.", table_body_style)],
    [Paragraph("<b>Receptionists & Clerks</b>", table_body_style), Paragraph("Staff Intake Terminal", table_body_style), Paragraph("Rapid walk-in registration, national identity (ABHA) verification & queue assignment.", table_body_style)],
    [Paragraph("<b>Attending Physicians</b>", table_body_style), Paragraph("Doctor Clinical Terminal", table_body_style), Paragraph("Consultations, ICD-11 coding, WHO EML CDSS recommendations, dosage checks & digital sign-off.", table_body_style)],
    [Paragraph("<b>Nurses & Ward Staff</b>", table_body_style), Paragraph("Nurse Ward Terminal", table_body_style), Paragraph("Real-time bed occupancy tracking, admissions/discharges & bio-fenced QR check-ins.", table_body_style)],
    [Paragraph("<b>Pharmacists</b>", table_body_style), Paragraph("Pharmacy Stock Terminal", table_body_style), Paragraph("Automatic stock deduction on doctor sign-off, inventory alerts & depletion forecasting.", table_body_style)],
    [Paragraph("<b>District Admins & Ministry</b>", table_body_style), Paragraph("Ministry Command Portal", table_body_style), Paragraph("Multi-facility monitoring, attendance audits, Gemini AI forecasting & anonymized analytics.", table_body_style)],
]

st_table = Table(stakeholder_data, colWidths=[120, 130, 280])
st_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [LIGHT_BG, colors.white]),
    ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(st_table)
elements.append(Spacer(1, 12))

# Exhaustive Feature Catalog
elements.append(Paragraph("2. Complete Feature & Technical Capability Catalog", h1_style))

features = [
    ("Haversine Bio-Fencing Telemetry", "Computes great-circle distance (R = 6,371,000m) to enforce staff presence within a strict 100.0-meter radius during shift check-ins."),
    ("Dynamic QR Shift Verification", "Generates cryptographic QR tokens bound to specific facilities and staff IDs to prevent proxy attendance."),
    ("ABDM / ABHA National Health Stack (Module A)", "Verifies national identity (India ABDM M1/M2/M3) at reception with automatic profile pre-fill and local intake fallback for un-enrolled patients."),
    ("HL7 FHIR R4 Standard Data Model", "Transforms intake and clinical records into HL7 FHIR R4 Patient, Condition (ICD-11), and MedicationRequest schemas."),
    ("Zero-Trust PII Privacy Shield", "Strips names, phone numbers, exact addresses, and hashes national IDs before sending telemetry to analytical pipelines."),
    ("Rules-Backed CDSS Engine (Module B)", "Provides WHO EML & ICD-11 grounded treatment guidelines for Malaria (1F40), Hypertension (BA00), Respiratory Infection (CA00), and Gastroenteritis (1A40)."),
    ("CRITICAL_DOSAGE_OVERFLOW_WARNING Fail-Safe", "Bounding checker validating daily intake against max daily safety limits (e.g. Paracetamol > 4g/day). Blocks issuance unless explicit doctor override reason is provided."),
    ("Physician Digital Sign-off", "Mandatory doctor digital signature protocol required to commit prescriptions to pharmacy logs and trigger stock deductions."),
    ("Global i18n Localization Engine (Module C)", "Dynamic runtime language switcher supporting en-US, hi-IN (Hindi), pt-BR (Portuguese), and ar-SA (Arabic with native RTL layout)."),
    ("Vector Clock & LWW Sync Manager (Module D)", "Offline queue ingestion resolving IndexedDB/SQLite local transaction conflicts via Vector Clock sequences and Last-Write-Wins timestamps."),
    ("Automated Pharmacy Stock Deduction", "Signed prescriptions automatically deduct stock levels in the live database and flag minimum safety threshold alerts."),
    ("Gemini AI & Velocity Stock Forecasting", "Combines local consumption velocity mathematics with Google Gemini AI (gemini-2.5-flash) to compute depletion runways and reorder warnings."),
    ("Live Bed Occupancy & Visual Degradation Tracking", "Monitors bed availability across General, ICU, and Emergency wards while displaying facility operational degradation badges.")
]

for title, desc in features:
    f_p = Paragraph(f"• <b>{title}:</b> {desc}", bullet_style)
    elements.append(f_p)

elements.append(Spacer(1, 10))

# Security & Data Sovereignty
elements.append(Paragraph("3. Security, Privacy & Data Sovereignty Protocols", h1_style))
sec_text = (
    "<b>Role-Based Access Control (RBAC):</b> Strictly enforces headers (<code>X-Active-Role</code> / <code>X-User-Role</code>) to restrict privileged actions (prescribing, bed allocation, inventory edits) to authorized staff.<br/>"
    "<b>Regional Data Sovereignty:</b> Raw patient identifiers (PII/PHI) never leave regional storage nodes. Telemetry streams receive anonymized FHIR bundles with masked names (<code>ANONYMIZED_PATIENT</code>) and coarsened birth years."
)
elements.append(Paragraph(sec_text, body_style))

# Build Document
doc.build(elements)
print(f"PDF successfully generated at {pdf_path}")
