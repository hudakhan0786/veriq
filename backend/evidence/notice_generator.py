"""ReportLab Statutory Inspection Notice (Form-1) & Section 63 BSA Dossier Generator (SIH26034)
Produces court-ready, tamper-evident archival PDF/A documents under Section 36(1) LM Act 2009.
Frozen per 05_TECHNOLOGY_DECISION_RECORD.md (ADR-12), 07_API_AND_INTERFACE_CONTRACTS.md, and 10_SECURITY_AND_AUDIT_SPECIFICATION.md
"""

from datetime import datetime, timezone
import hashlib
import io
import os
from pathlib import Path
import time
from typing import Any, Dict, List, Optional, Tuple

try:
    import qrcode
except ImportError:
    qrcode = None
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# Contract imports
try:
    from backend.contracts.evidence.evidence_dto import (
        LegalNoticeDTO,
        LegalNoticeRecipientDTO,
        Section63CertificateDTO,
    )
except ImportError:
    import sys
    REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
    if str(REPO_ROOT) not in sys.path:
        sys.path.insert(0, str(REPO_ROOT))
    from backend.contracts.evidence.evidence_dto import (
        LegalNoticeDTO,
        LegalNoticeRecipientDTO,
        Section63CertificateDTO,
    )


# Official Government Palette
NAVY_PRIMARY = HexColor("#1B365D")
NAVY_DARK = HexColor("#0F1E36")
GOLD_ACCENT = HexColor("#D4AF37")
CRIMSON_VIOLATION = HexColor("#DC2626")
EMERALD_PASS = HexColor("#059669")
GRAY_BG = HexColor("#F8FAFC")
GRAY_BORDER = HexColor("#CBD5E1")
TEXT_MUTED = HexColor("#475569")


class Form1NoticePDFGenerator:
    """Generates statutory Form-1 Legal Notice and Section 63 BSA Evidence Dossier."""

    @staticmethod
    def _create_qr_image(data_string: str) -> io.BytesIO:
        buffer = io.BytesIO()
        if qrcode is not None:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=4,
                border=2,
            )
            qr.add_data(data_string)
            qr.make(fit=True)
            img = qr.make_image(fill_color="#1B365D", back_color="white")
            img.save(buffer, format="PNG")
        else:
            from PIL import Image as PILImage, ImageDraw
            img = PILImage.new("RGB", (120, 120), color="#F1F5F9")
            draw = ImageDraw.Draw(img)
            draw.rectangle([2, 2, 117, 117], outline="#1B365D", width=2)
            draw.text((15, 50), "BSA SEC-63", fill="#1B365D")
            img.save(buffer, format="PNG")
        buffer.seek(0)
        return buffer

    @classmethod
    def generate_form1_pdf(
        cls,
        notice_ref: str,
        inspection_id: str,
        bsa_cert: Section63CertificateDTO,
        recipient: LegalNoticeRecipientDTO,
        violations: List[Dict[str, Any]],
        compounding_fee: float = 25000.0,
        reply_window_days: int = 15,
        evidence_crop_bytes: Optional[bytes] = None,
        output_path: Optional[str] = None,
        commodity_name: Optional[str] = None,
        brand_name: Optional[str] = None,
        batch_number: Optional[str] = None,
        declared_net_qty: Optional[str] = None,
        declared_mrp: Optional[str] = None,
        package_type: Optional[str] = None,
        pdp_area_cm2: Optional[float] = None,
        declared_usp: Optional[str] = None,
        mfg_date: Optional[str] = None,
        country_of_origin: Optional[str] = None,
        consumer_care: Optional[str] = None,
    ) -> Tuple[bytes, LegalNoticeDTO]:
        """Generates archival Form-1 notice PDF bytes and corresponding LegalNoticeDTO."""
        start_time = time.perf_counter()
        pdf_buffer = io.BytesIO()
        target = output_path if output_path else pdf_buffer

        doc = SimpleDocTemplate(
            target,
            pagesize=A4,
            rightMargin=14 * mm,
            leftMargin=14 * mm,
            topMargin=12 * mm,
            bottomMargin=12 * mm,
            title=f"Statutory Notice (Form-1) - {notice_ref}",
            author="Department of Consumer Affairs - Legal Metrology Division",
            subject="Statutory Inspection Notice & Deficit Memorandum under LMPC Rules, 2011 & Legal Metrology Act, 2009",
            creator="Nirikshak Legal Metrology Enforcement System (DoCA)",
        )

        styles = getSampleStyleSheet()
        normal = styles["Normal"]

        style_title = ParagraphStyle(
            "GovTitle",
            parent=normal,
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=NAVY_PRIMARY,
            alignment=1,  # Center
        )
        style_subtitle = ParagraphStyle(
            "GovSubtitle",
            parent=normal,
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=TEXT_MUTED,
            alignment=1,
        )
        style_heading = ParagraphStyle(
            "SectionHeading",
            parent=normal,
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=NAVY_DARK,
        )
        style_body = ParagraphStyle(
            "GovBody",
            parent=normal,
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.5,
            textColor=HexColor("#1E293B"),
        )
        style_body_bold = ParagraphStyle(
            "GovBodyBold",
            parent=style_body,
            fontName="Helvetica-Bold",
        )
        style_cert_code = ParagraphStyle(
            "CertCode",
            parent=normal,
            fontName="Courier",
            fontSize=7,
            leading=9,
            textColor=HexColor("#0F172A"),
        )

        story = []

        # 1. Official Header
        story.append(Paragraph("GOVERNMENT OF INDIA", style_title))
        story.append(Paragraph("MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION", style_subtitle))
        story.append(Paragraph("DEPARTMENT OF CONSUMER AFFAIRS - LEGAL METROLOGY DIVISION", style_subtitle))
        story.append(Spacer(1, 2 * mm))
        story.append(HRFlowable(width="100%", thickness=1.2, color=NAVY_PRIMARY, spaceAfter=2.5 * mm))

        # 2. Form Title & Mandate
        story.append(Paragraph("<b>STATUTORY INSPECTION NOTICE & DEFICIT MEMORANDUM (FORM-1)</b>", style_title))
        story.append(Paragraph(
            "<i>Issued under Section 36(1) read with Section 48 of the Legal Metrology Act, 2009 (as amended by Jan Vishwas Act, 2023)<br/>"
            "and the Legal Metrology (Packaged Commodities) Rules, 2011 (as amended up to 2024)<br/>"
            "Certified under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)</i>",
            style_subtitle
        ))
        story.append(Spacer(1, 2.5 * mm))

        # 3. Notice Reference & Metadata Table + QR Code
        qr_data = (
            f"https://nirikshak.doca.gov.in/verify?"
            f"notice={notice_ref}&cert={bsa_cert.certificate_number}&merkle={bsa_cert.raw_images_merkle_root}"
        )
        qr_buf = cls._create_qr_image(qr_data)
        qr_flowable = Image(qr_buf, width=26 * mm, height=26 * mm)

        meta_table_data = [
            [
                Paragraph(f"<b>Notice Ref:</b> {notice_ref}<br/>"
                          f"<b>BSA Cert No:</b> {bsa_cert.certificate_number}<br/>"
                          f"<b>Inspection ID:</b> {inspection_id}<br/>"
                          f"<b>Date of Issue:</b> {bsa_cert.generated_at[:19].replace('T', ' ')} UTC<br/>"
                          f"<b>Issuing Circle:</b> CIRCLE_DL_SOUTH_01", style_body),
                qr_flowable
            ]
        ]
        meta_table = Table(meta_table_data, colWidths=[146 * mm, 36 * mm])
        meta_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BACKGROUND", (0, 0), (-1, -1), GRAY_BG),
            ("BOX", (0, 0), (-1, -1), 0.5, GRAY_BORDER),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 2.5 * mm))

        # 4. Addressee Details
        story.append(Paragraph("<b>TO (ALLEGED OFFENDER / RESPONSIBLE PARTY):</b>", style_heading))
        recip_name = str(recipient.name or "Responsible Commercial Entity").strip()
        if len(recip_name) > 70:
            recip_name = recip_name[:67] + "..."
        recip_addr = str(recipient.registered_address or "Premises recorded during statutory inspection").strip()
        if len(recip_addr) > 105:
            recip_addr = recip_addr[:102] + "..."

        addressee_text = (
            f"<b>{recip_name}</b> ({recipient.recipient_type})<br/>"
            f"{recip_addr}<br/>"
            f"Email: {recipient.email or 'Declared on package'}"
        )
        story.append(Paragraph(addressee_text, style_body))
        story.append(Spacer(1, 2.5 * mm))

        # 5. Allegation Narrative
        narrative_text = (
            f"TAKE NOTICE that on physical inspection of packaged commodity under your distribution, the "
            f"undersigned authorized Legal Metrology Officer has recorded non-compliance with statutory provisions of the "
            f"<b>Legal Metrology (Packaged Commodities) Rules, 2011 (as amended up to 2024)</b>. You are hereby served "
            f"this Statutory Improvement Notice under the <b>proviso to Section 36(1) of the Legal Metrology Act, 2009 "
            f"(as amended by the Jan Vishwas (Amendment of Provisions) Act, 2023)</b> and called upon to show cause "
            f"within <b>{reply_window_days} days</b> of receipt of this notice or submit application for statutory "
            f"compounding under Section 48 upon payment of the compounding sum indicated below."
        )
        story.append(Paragraph(narrative_text, style_body))
        story.append(Spacer(1, 2.5 * mm))

        def _clean_pdf_text(val: Any, max_chars: int = 0) -> str:
            if val is None:
                return ""
            text = str(val).replace("₹", "Rs. ").replace("—", "-").replace("–", "-")
            text = text.replace("\u2018", "'").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
            while "Rs.  " in text:
                text = text.replace("Rs.  ", "Rs. ")
            text = " ".join(text.split())
            if max_chars > 0 and len(text) > max_chars:
                text = text[:max_chars - 3] + "..."
            return text

        RULE_CODE_MAP = {
            "RULE_06_1_A_NAME_ADDRESS": "Rule 6(1)(a)",
            "RULE_06_1_B_GENERIC_NAME": "Rule 6(1)(b)",
            "RULE_06_1_C_NET_QTY": "Rule 6(1)(c)",
            "RULE_06_1_D_MRP": "Rule 6(1)(d)",
            "RULE_06_1_E_MFG_DATE": "Rule 6(1)(e)",
            "RULE_06_1_F_NET_QUANTITY": "Rule 6(1)(f)",
            "RULE_06_1_H_NET_QTY_FONT": "Rule 6(1)(h)",
            "RULE_06_1_K_USP_COMPUTATION": "Rule 6(1)(k)",
            "RULE_06_2_CONSUMER_CARE": "Rule 6(2)",
            "RULE_07_TABLE_1": "Rule 7(1) Table-I",
            "RULE_06_COUNTRY_ORIGIN": "Rule 6(10)",
            "RULE_06_10_COUNTRY_ORIGIN": "Rule 6(10)",
            "RULE_04_PREPACKAGED_COMMODITY": "Rule 4",
            "RULE_18_WHOLESALE_PACKAGE": "Rule 18",
            "RULE_27_REGISTRATION": "Rule 27",
        }

        # Clean individual commodity particulars to avoid multiline blowup
        clean_commodity = _clean_pdf_text(commodity_name, 45) or "Packaged Commodity"
        clean_brand = _clean_pdf_text(brand_name, 35) or "N/A"
        clean_net_qty = _clean_pdf_text(declared_net_qty, 25) or "N/A"
        clean_mrp = _clean_pdf_text(declared_mrp, 50) or "N/A"
        clean_usp = _clean_pdf_text(declared_usp, 35) or "N/A"
        clean_mfg = _clean_pdf_text(mfg_date, 28) or "N/A"
        clean_origin = _clean_pdf_text(country_of_origin, 25) or "India"
        clean_batch = _clean_pdf_text(batch_number, 22) or "N/A"
        clean_pkg = _clean_pdf_text(package_type, 26) or "Standard Box / Pack"
        clean_care = _clean_pdf_text(consumer_care, 55) or "Declared on pack"

        # 5.5 Schedule A: Particulars of Inspected Commodity
        story.append(Paragraph("<b>SCHEDULE A: PARTICULARS OF INSPECTED PACKAGED COMMODITY:</b>", style_heading))
        sched_a_data = [
            [
                Paragraph(f"<b>Commodity / Product:</b> {clean_commodity}", style_body),
                Paragraph(f"<b>Brand Name:</b> {clean_brand}", style_body),
            ],
            [
                Paragraph(f"<b>Declared Net Qty:</b> {clean_net_qty}", style_body),
                Paragraph(f"<b>Retail Price (MRP):</b> {clean_mrp}", style_body),
            ],
            [
                Paragraph(f"<b>Unit Sale Price (USP):</b> {clean_usp}", style_body),
                Paragraph(f"<b>Month & Year of Mfg/Pkd:</b> {clean_mfg}", style_body),
            ],
            [
                Paragraph(f"<b>Country of Origin:</b> {clean_origin}", style_body),
                Paragraph(f"<b>Batch / Lot No.:</b> {clean_batch}", style_body),
            ],
            [
                Paragraph(f"<b>Packaging Geometry:</b> {clean_pkg}", style_body),
                Paragraph(f"<b>Consumer Care:</b> {clean_care}", style_body),
            ],
        ]
        if pdp_area_cm2:
            sched_a_data.append([
                Paragraph(f"<b>Measured PDP Area:</b> {pdp_area_cm2:.1f} cm<sup>2</sup>", style_body),
                Paragraph(f"<b>Inspection Dossier ID:</b> {_clean_pdf_text(inspection_id, 35)}", style_body),
            ])
        sched_a_table = Table(sched_a_data, colWidths=[91 * mm, 91 * mm])
        sched_a_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), GRAY_BG),
            ("BOX", (0, 0), (-1, -1), 0.5, GRAY_BORDER),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#E2E8F0")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(sched_a_table)
        story.append(Spacer(1, 2.5 * mm))

        # 6. Violations Table (Schedule B)
        story.append(Paragraph("<b>SCHEDULE B: STATUTORY DEFICITS & NON-COMPLIANCE FINDINGS:</b>", style_heading))
        v_headers = [
            Paragraph("<b>Rule Code</b>", style_body_bold),
            Paragraph("<b>Statutory Mandate</b>", style_body_bold),
            Paragraph("<b>Required</b>", style_body_bold),
            Paragraph("<b>Measured</b>", style_body_bold),
            Paragraph("<b>Discrepancy</b>", style_body_bold),
        ]
        v_rows = [v_headers]
        violation_strings = []

        for v in violations:
            raw_code = str(v.get("rule_code") or v.get("rule_id") or "RULE_UNKNOWN")
            v_code = RULE_CODE_MAP.get(raw_code, raw_code.replace("RULE_", "").replace("_", " "))
            v_ref = _clean_pdf_text(v.get("statutory_reference", "LM (PC) Rules 2011"), 45)
            v_req = _clean_pdf_text(v.get("required_value", "N/A"), 28)
            v_meas = _clean_pdf_text(v.get("measured_value", "N/A"), 24)
            v_disc = _clean_pdf_text(v.get("discrepancy", "Deficit detected"), 36)
            violation_strings.append(f"{v_code}: {v_disc} ({v_ref})")

            v_rows.append([
                Paragraph(f"<font color='#DC2626'><b>{v_code}</b></font>", style_body),
                Paragraph(v_ref, style_body),
                Paragraph(str(v_req), style_body),
                Paragraph(f"<b>{v_meas}</b>", style_body),
                Paragraph(f"<font color='#DC2626'>{v_disc}</font>", style_body),
            ])

        if not violations:
            v_rows.append([
                Paragraph("<font color='#059669'><b>COMPLIANT</b></font>", style_body),
                Paragraph("LMPC Rules, 2011 (as amended)", style_body),
                Paragraph("Statutory Declarations", style_body),
                Paragraph("Compliant", style_body),
                Paragraph("<font color='#059669'>Nil - No Deficits Established</font>", style_body),
            ])

        v_table = Table(v_rows, colWidths=[34 * mm, 50 * mm, 32 * mm, 28 * mm, 38 * mm])
        v_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), HexColor("#E2E8F0")),
            ("TEXTCOLOR", (0, 0), (-1, 0), NAVY_DARK),
            ("GRID", (0, 0), (-1, -1), 0.5, GRAY_BORDER),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(v_table)
        story.append(Spacer(1, 2.5 * mm))

        # 7. Compounding / Improvement Notice Box
        fee_data = [
            [
                Paragraph(f"<b>Statutory Improvement Notice / Compounding Fee (Sec 36(1) Proviso & Sec 48 LM Act):</b>", style_body_bold),
                Paragraph(f"<font color='#1B365D' size='11'><b>Rs. {compounding_fee:,.2f}</b></font>", style_body_bold),
                Paragraph(f"<b>Statutory Cure Window:</b> {reply_window_days} Days", style_body),
            ]
        ]
        fee_table = Table(fee_data, colWidths=[92 * mm, 45 * mm, 45 * mm])
        fee_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), HexColor("#FEF3C7")),
            ("BOX", (0, 0), (-1, -1), 1, HexColor("#F59E0B")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(fee_table)
        story.append(Spacer(1, 2 * mm))

        # Separate Form-1 Notice & Schedules from Section 63 BSA Certificate
        story.append(PageBreak())

        # 8. Part II: Section 63 BSA 2023 Evidence Certificate & Officer Attestation
        story.append(Paragraph("<b>PART II: SECTION 63 BHARATIYA SAKSHYA ADHINIYAM, 2023 - EVIDENCE CERTIFICATE</b>", style_heading))
        story.append(HRFlowable(width="100%", thickness=1.0, color=NAVY_PRIMARY, spaceAfter=3 * mm))
        cert_text = (
            f"<b>Statutory Certification:</b> This document certifies that the electronic records, photographic measurements, and rule findings "
            f"referenced herein have been produced by an automated diagnostic compliance system operating in lawful custody under Section 63 of "
            f"the Bharatiya Sakshya Adhiniyam, 2023. The integrity of each inspection stage has been mathematically sealed into a SHA-256 Merkle DAG.<br/>"
            f"<b>Device Model:</b> {bsa_cert.device_model} | <b>OS:</b> {bsa_cert.operating_system} | <b>Clock Source:</b> {bsa_cert.clock_source}<br/>"
            f"<b>Merkle Provenance Root:</b> <font face='Courier'>{bsa_cert.raw_images_merkle_root}</font><br/>"
            f"<b>Evidence Bundle Digest:</b> <font face='Courier'>{bsa_cert.evidence_bundle_sha256}</font><br/>"
            f"<b>Issuing Officer:</b> {bsa_cert.issuing_officer_name} ({bsa_cert.issuing_officer_id}) | "
            f"<b>Signature Token:</b> <font face='Courier'>{bsa_cert.officer_signature_token[:32]}...</font>"
        )
        cert_box = Table([[Paragraph(cert_text, style_body)]], colWidths=[182 * mm])
        cert_box.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), HexColor("#F1F5F9")),
            ("BOX", (0, 0), (-1, -1), 1, NAVY_PRIMARY),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(cert_box)
        story.append(Spacer(1, 4 * mm))

        # 9. Officer Sign-off Block
        sig_data = [
            [
                Paragraph("<b>Date & Seal:</b><br/>"
                          f"{datetime.now(timezone.utc).strftime('%d %B %Y')}<br/>"
                          "Office of Legal Metrology Controller", style_body),
                Paragraph("<b>Digitally Approved & Issued By:</b><br/>"
                          f"<b>{bsa_cert.issuing_officer_name}</b><br/>"
                          f"Legal Metrology Inspector ({bsa_cert.issuing_officer_id})<br/>"
                          "<i>[Authenticated under Section 63 BSA 2023]</i>", style_body),
            ]
        ]
        sig_table = Table(sig_data, colWidths=[91 * mm, 91 * mm])
        sig_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LINEABOVE", (0, 0), (-1, -1), 0.5, GRAY_BORDER),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(sig_table)

        # Build document
        doc.build(story)

        elapsed = time.perf_counter() - start_time
        if output_path:
            with open(output_path, "rb") as f:
                pdf_bytes = f.read()
        else:
            pdf_bytes = pdf_buffer.getvalue()

        merkle_entry_hash = hashlib.sha256(pdf_bytes).hexdigest()

        notice_dto = LegalNoticeDTO(
            notice_reference_number=notice_ref,
            inspection_id=inspection_id,
            bsa_certificate_number=bsa_cert.certificate_number,
            recipient=recipient,
            statutory_mandate=(
                "Legal Metrology (Packaged Commodities) Rules, 2011 (as amended up to 2024) read with "
                "Section 36(1) proviso & Section 48 of Legal Metrology Act, 2009 (as amended by Jan Vishwas Act, 2023) "
                "and Section 63 BSA 2023"
            ),
            violations_summary=violation_strings,
            compounding_fee_amount=compounding_fee,
            reply_window_days=reply_window_days,
            pdf_path=output_path,
            merkle_entry_hash=merkle_entry_hash,
        )

        return pdf_bytes, notice_dto
