import { InspectionCase, ExtractedField } from "../types/inspection";

export interface StatutoryRecipient {
  type: "MANUFACTURER" | "PACKER" | "IMPORTER" | "ECOMMERCE_PLATFORM" | "SELLER";
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

/**
 * Extracts authentic statutory recipient details from an InspectionCase using
 * Section 63 BSA 2023 certified OCR declarations and case metadata.
 */
export function extractStatutoryRecipient(caseData: InspectionCase): StatutoryRecipient {
  const fields = caseData.extracted_fields || [];

  let name = "";
  let address = "";
  let email = "";
  let phone = "";
  let type: "MANUFACTURER" | "PACKER" | "IMPORTER" = "MANUFACTURER";

  // 1. Check for Manufacturer / Packer / Importer address fields
  const mfgField = fields.find((f: ExtractedField) =>
    f.field_type === "MANUFACTURER_ADDRESS" || f.field_type === "MANUFACTURER"
  );
  const packerField = fields.find((f: ExtractedField) =>
    f.field_type === "PACKER_ADDRESS"
  );
  const importerField = fields.find((f: ExtractedField) =>
    f.field_type === "IMPORTER_ADDRESS" || f.field_type === "IMPORTER"
  );
  const ccField = fields.find((f: ExtractedField) =>
    f.field_type === "CONSUMER_CARE_CONTACT" || f.field_type === "CONSUMER_CARE"
  );

  const targetEntityField = mfgField || packerField || importerField;
  if (targetEntityField) {
    if (importerField && !mfgField && !packerField) {
      type = "IMPORTER";
    } else if (packerField && !mfgField) {
      type = "PACKER";
    }

    const norm = targetEntityField.normalized_value || {};
    name = norm.name || "";
    address = norm.address_line || norm.raw_text || targetEntityField.raw_ocr_text || "";
  }

  // 2. Extract consumer care contacts
  if (ccField) {
    const ccNorm = ccField.normalized_value || {};
    email = ccNorm.email || "";
    phone = ccNorm.phone || "";
    if (!address && ccNorm.address) {
      address = ccNorm.address;
    }
  }

  // 3. Fallbacks to case-level metadata if OCR fields were omitted
  if (!name) {
    name =
      caseData.manufacturer_name ||
      caseData.establishment_name ||
      caseData.brand_name ||
      "Responsible Commercial Entity";
  }

  if (!address) {
    address =
      caseData.premises_address ||
      "Premises recorded during statutory inspection under LMPC Rules, 2011 & Section 15 Legal Metrology Act, 2009";
  }

  // Clean formatting
  name = name.trim();
  address = address.trim();
  email = email.trim();
  phone = phone.trim();

  return {
    type,
    name,
    address,
    email: email || undefined,
    phone: phone || undefined,
  };
}
