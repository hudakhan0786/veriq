# Member 3 — Semantic Extraction & NLP

**Assigned Engineer:** **Harsh Patel** ([@harshpatelcse](https://github.com/harshpatelcse))  
**Assigned Workstream:** Statutory Entity Normalization (MRP, Net Qty, USP, Mfg Date, Origin, Address, Consumer Care) & Banned Unit Detection  
**Assigned Folder:** `backend/extraction/`  
**Git Feature Branch:** `feat/m3-extraction`  

---

## 1. What is my job?
Your job is to convert raw OCR tokens into structured, verified statutory packaging entities without hallucinations.
You write deterministic regex parsers for MRP, tax clauses, Net Quantity, Unit Sale Price, and addresses.
You implement a banned unit detector (flagging prohibited non-standard symbols like `gms`, `gm`, `Kgs`, `ML`, `ltrs` under Section 11 / Rule 12).
You convert Devanagari numerals (०..९) to standard decimal numbers.
You verify Indian postal addresses (State + 6-digit PIN) and Consumer Care completeness (4-tuple).
You NEVER use a generative LLM to guess missing statutory declarations.

---

## 2. What files am I allowed to change?
You are allowed to create and edit files strictly inside:
- `backend/extraction/**`

You may read shared contracts in `backend/contracts/extraction/` and `backend/contracts/ocr/`.
You must NOT edit other member directories or root specification files.

---

## 3. What documents must I read?
1. `AGENTS.md` (Root team rules)
2. `02_FINAL_REQUIREMENTS_SPECIFICATION.md` (FR-07 to FR-13)
3. `03_FINAL_ARCHITECTURE.md` (Stage 8: Semantic Entity Classification)
4. `07_API_AND_INTERFACE_CONTRACTS.md` (`ExtractedFieldDTO`, `NormalizedCommodityFacts`)
5. `11_TESTING_AND_VALIDATION_PLAN.md` (`TS-UNIT-01`, `TS-UNIT-02`, `TS-UNIT-03`, `TS-UNIT-09`)
6. `16_DECISION_LOG.md` (ADL-04: Hybrid Perception-Verification)
7. `17_OPEN_QUESTIONS.md` (OQ-02: Minimum Address Parsing Tokens)
8. `10_SECURITY_AND_AUDIT_SPECIFICATION.md`

---

## 4. What inputs do I use?
- `OCROutput` token payloads conforming to `backend/contracts/ocr/ocr_dto.py`.
- Static OCR JSON fixtures in `backend/extraction/fixtures/`.

---

## 5. What outputs do I produce?
- `NormalizedCommodityFacts` conforming to `backend/contracts/extraction/extraction_dto.py`.

---

## 6. What contract do I follow?
- `backend/contracts/extraction/extraction_dto.py` and `backend/contracts/extraction/extraction_schema.json`.

---

## 7. How do I run my module?
```bash
python backend/extraction/extractor.py
```

---

## 8. How do I run tests?
```bash
pytest backend/extraction/tests/ -v
```

---

## 9. What counts as complete?
Your module is complete when:
1. Banned units (`gms`, `ML`, etc.) are 100% reliably detected.
2. MRP, tax inclusion, Net Qty, and USP are correctly normalized.
3. Indic numerals (०–९) convert accurately to IEEE floats.
4. Indian PIN code regex matches 6-digit formats without false triggers on phone numbers.
5. All unit tests pass with $> 85\%$ coverage.
6. `progress.md` is marked `COMPLETE — YYYY-MM-DD HH:MM IST`.
7. `memory.md` is updated.

---

## 10. What must I NOT depend on?
- You must NOT depend on Member 2's unfinished OCR code. Use frozen OCR test fixtures!
- You must NOT depend on generative LLM APIs.
- You must NOT evaluate final legal penalties (that belongs to Member 4).
Your module runs completely on local OCR fixtures!

---

## 11. Multi-Facet Cross-Panel Semantic Fusion (`fusion.py`)

Physical retail packaging frequently distributes statutory declarations across multiple faces of a 3D container. The extraction engine supports multi-angle cross-panel hierarchical fusion:
- **`PANEL_PRIORITY` Hierarchy:**
  - `FRONT_PDP` / `PDP_FRONT`: Rank 100 (Primary declaration surface: commodity name, brand, net quantity).
  - `SIDE_PANEL_LEFT` / `SIDE_PANEL_RIGHT` / `SIDE_PANEL`: Rank 80 (Side legal metrology panels: MRP, Unit Sale Price, dates).
  - `MACRO_CLOSE_UP` / `CLOSE_UP`: Rank 75 (High-resolution batch and date stamps).
  - `STAMP`: Rank 70 (Thermal / inkjet manufacturing marks).
  - `BOTTOM_BASE`: Rank 65 (Base flap carton declarations).
  - `BACK_PANEL`: Rank 60 (Manufacturer registered factory, corporate entities, consumer care).
- Aggregates facts without losing source token bounding polygon provenance and panel IDs for Section 63 BSA 2023 evidentiary auditing.

---

## 12. Real Physical Packaging Benchmark Suite

The module is verified against real retail commercial packaging datasets (`tests/test_physical_dataset_benchmark.py`):
1. **Fastrack Wristwatch (`REAL-PKG-WATCH`):** Single-unit count normalization (`01 NUMBER` -> `1 N`), exempt from Unit Sale Price under Rule 6(1)(da) Second Proviso.
2. **Himalaya Brahmi 60T (`REAL-PKG-BRAHMI`):** Multi-facet tri-panel fusion, inverted unit rate (`Rs. 4.33/TAB.`), 6-digit factory PIN `560058`.
3. **Dot & Key Face Wash (`REAL-PKG-FACEWASH`):** Dual corporate entity decoupling (Manufacturer in Himachal Pradesh vs Marketer in West Bengal), volume unit rate (`₹2.49/ml`).
4. **Bella Vita Perfume (`REAL-PKG-PERFUME`):** Base panel batch stamp fusion, rate parsing (`₹19.95/ml`).
5. **Haldiram's Namkeen (`REAL-PKG-NAMKEEN`):** Strict SI metric symbol verification (`400 g` passes with 0 prohibited units), rate math (`Rs. 0.25/g`).
6. **True Elements Chia Seeds (`REAL-PKG-CHIA`):** Nutritional facts isolation, alphanumeric customer care phone/email verification.

---

## 13. Production Cloud Architecture, Edge Proxy & Multi-Image Pipeline Delivery

To ensure 24/7 high availability and zero downtime for national-scale metrology enforcement, Harsh Patel spearheaded the deployment and infrastructure overhaul:

- **Oracle Cloud Infrastructure (OCI) Deployment:** Provisioned and hardened a persistent 24/7 Ubuntu VPS host running the complete Nirikshak FastAPI backend, ONNX Runtime CPU execution provider, and Merkle ledger storage. Configured a dedicated 4GB swap space (`/swapfile`) ensuring headroom for multi-megabyte high-resolution image OCR matrices.
- **Vercel Edge Proxy Integration:** Architected the unified edge proxy configuration (`vercel.json`) connecting global edge points to the backend VPS without CORS overhead, enabling sub-80ms API routing.
- **Multi-Image Cross-Facet Pipeline Execution:** Verified end-to-end multi-image ingestion, facet spatial fusion, and real-time evidence streaming, ensuring front packaging, nutritional matrices, and statutory side panels are consolidated seamlessly into single tamper-proof inspection dossiers.
- **Performance Benchmarking & Dead Code Purge:** Benchmarked global TTFB latency (~78ms) and eliminated all legacy serverless/Render dependencies to ensure a clean, deterministic production codebase.


