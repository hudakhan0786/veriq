# Member 5 — Lead Backend, Platform, Security & Evidentiary Dossier

**Assigned Engineer:** **Shailendra Pratap Singh** ([@shailendrapratap1](https://github.com/shailendrapratap1))  
**Assigned Workstream:** FastAPI Application Server, PostgreSQL 16+ Datastore, Decoupled Storage, SHA-256 Merkle DAG & Section 63 BSA 2023 PDF/A Dossier Generator  
**Assigned Folder:** `backend/evidence/`  
**Git Feature Branch:** `feat/m5-evidence`  

---

## 1. What is my job?
Your job is to deliver the core backend web platform and electronic evidence pipeline.
You build:
- FastAPI modular application server with async lifespan, Pydantic v2 schemas, and JWT authentication (RBAC: `ADMIN`, `CONTROLLER`, `INSPECTOR`, `VIEWER`).
- Central PostgreSQL 16+ database schemas with SQLAlchemy 2.0 and Alembic migrations.
- File storage decoupling: large images and PDFs are stored in `/storage/uploads/` and `/storage/evidence/`—never as binary BLOBs in SQL tables.
- SHA-256 Merkle Directed Acyclic Graph (DAG) chaining every stage of the inspection for unbroken chain of custody.
- Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) Electronic Evidence Certificate.
- ReportLab PDF/A generator producing court-ready statutory Inspection Notices (Form-1).
- Mode B offline bundle ingestion endpoint (`POST /api/v1/inspections/sync-bundle`).

---

## 2. What files am I allowed to change?
You are allowed to create and edit files strictly inside:
- `backend/evidence/**`

You may read shared contracts in `backend/contracts/evidence/`, `backend/contracts/ui/`, and `08_DATABASE_SPECIFICATION.md`.
You must NOT edit other member directories or root specification files.

---

## 3. What documents must I read?
1. `AGENTS.md` (Root team rules)
2. `03_FINAL_ARCHITECTURE.md` (Stage 1 & 12, Component Matrix)
3. `05_TECHNOLOGY_DECISION_RECORD.md` (ADR-01: FastAPI, ADR-04: PostgreSQL/Storage, ADR-09: Merkle, ADR-10: BSA 2023, ADR-12: ReportLab)
4. `07_API_AND_INTERFACE_CONTRACTS.md` (Complete REST catalog & schemas)
5. `08_DATABASE_SPECIFICATION.md` (Complete DDL & indices)
6. `10_SECURITY_AND_AUDIT_SPECIFICATION.md` (JWT RBAC, Merkle DAG, Section 63 BSA Certificate)
7. `11_TESTING_AND_VALIDATION_PLAN.md` (`TS-EVID-01`, `TS-EVID-02`, `TS-WEB-01` to `TS-WEB-03`)
8. `16_DECISION_LOG.md` (ADL-02, ADL-08, ADL-14, ADL-15, ADL-19)
9. `10_SECURITY_AND_AUDIT_SPECIFICATION.md` (Section 3 & 4: Evidentiary Admissibility Bounds)

---

## 4. What inputs do I use?
- Pipeline execution outputs from `backend/contracts/`.
- Database configurations (PostgreSQL in production, SQLite in local Mode B).
- Pipeline output fixtures in `backend/evidence/fixtures/`.

---

## 5. What outputs do I produce?
- REST API responses matching `backend/contracts/ui/ui_contract_schema.json`.
- `BSAEvidenceBundleDTO` and `Section63CertificateDTO` matching `backend/contracts/evidence/evidence_dto.py`.
- Court-ready archival `InspectionNotice_Form1.pdf`.

---

## 6. What contract do I follow?
- `backend/contracts/evidence/evidence_dto.py`, `backend/contracts/ui/ui_contract_schema.json`, and `08_DATABASE_SPECIFICATION.md`.

---

## 7. How do I run my module?
```bash
python -m backend.evidence.server
```

---

## 8. How do I run tests?
```bash
pytest backend/evidence/tests/ -v
```

---

## 9. What counts as complete?
Your module is complete when:
1. Merkle DAG hashes every stage and flags 100% of single-character payload tampering.
2. Section 63 BSA 2023 certificate generates with device telemetry and officer signature.
3. ReportLab renders court-ready Form-1 notice in $< 1.5\text{ seconds}$.
4. FastAPI endpoints validate headers (`X-Request-ID`, `X-Device-Fingerprint`) and return OpenAPI 3.1 schemas.
5. All unit tests pass with $> 85\%$ coverage.
6. `progress.md` is marked `COMPLETE — YYYY-MM-DD HH:MM IST`.
7. `memory.md` is updated.

---

## 10. What must I NOT depend on?
- You must NOT wait for Member 6's web UI; test endpoints with `pytest` and `httpx`.
- You must NOT depend on other members' internal code; use static pipeline fixtures.
Your module runs independently and provides the central platform backend!

---

## 11. Workstream Sign-off & Verification
- **Lead Engineer:** **Shailendra Pratap Singh** ([@shailendrapratap1](https://github.com/shailendrapratap1))
- **Verification Status:** 100% Passing (56/56 tests passing in 6.98s)
- **Delivered Subsystems:** Section 63 BSA 2023 Digital Evidence Certificate, SHA-256 Merkle DAG Chain-of-Custody, ReportLab Form-1 PDF Generation & FastAPI Platform Backend

