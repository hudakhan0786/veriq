# Member 4 — Statutory Legal Metrology Rule Engine

**Assigned Engineer:** **Ambika Bansal** ([@bansalambika12-ship-it](https://github.com/bansalambika12-ship-it))  
**Assigned Workstream:** Deterministic Legal Compliance (Packaged Commodities Rules 2011), Table-I Font Schedule, USP Arithmetic, Temporal Epoch Dispatcher & 4-State Epistemic Triage  
**Assigned Folder:** `backend/rule_engine/`  
**Git Feature Branch:** `feat/m4-rule-engine`  

---

## 1. What is my job?
Your job is to translate the Legal Metrology Act, 2009 and the LMPC Rules, 2011 into an immutable, deterministic Abstract Syntax Tree (AST) compliance engine.
You evaluate:
- Table-I minimum font heights as a function of Principal Display Panel (PDP) area ($\le 50\text{ cm}^2 \implies 1.0\text{ mm}$; $50-100 \implies 1.5\text{ mm}$; $100-500 \implies 2.5\text{ mm}$; $500-2500 \implies 4.0\text{ mm}$; $> 2500 \implies \mathbf{6.0\text{ mm}}$).
- Unit Sale Price (USP) mathematical consistency: $|(\text{USP} \times \text{NetQty}) - \text{MRP}| \le 0.02$.
- Temporal Statutory Epoch Dispatcher matching product Mfg Date to rule snapshot (2011 Base, 2017 Font, 2021 USP, 2023 Jan Vishwas).
- E-Commerce compliance under Rule 6(10) (strictly exempting manufacturing date) and Rule 6(10A) (Country of Origin filter).
- Epistemic 4-State Triage (`PASS`, `FAIL`, `REVIEW`, `UNABLE_TO_VERIFY`).
- Zero LLMs, zero hallucinations, 100% reproducible execution in $< 15\text{ ms}$.

---

## 2. What files am I allowed to change?
You are allowed to create and edit files strictly inside:
- `backend/rule_engine/**`

You may read shared contracts in `backend/contracts/compliance/` and `backend/contracts/extraction/`.
You must NOT edit other member directories or root specification files.

---

## 3. What documents must I read?
1. `AGENTS.md` (Root team rules)
2. `02_FINAL_REQUIREMENTS_SPECIFICATION.md` (FR-08 to FR-16)
3. `03_FINAL_ARCHITECTURE.md` (Stage 10: Deterministic Legal Metrology Rules)
4. `05_TECHNOLOGY_DECISION_RECORD.md` (ADR-07: Deterministic AST Rule Engine)
5. `07_API_AND_INTERFACE_CONTRACTS.md` (`RuleEvaluationDTO`, `ComplianceVerdictResult`)
6. `11_TESTING_AND_VALIDATION_PLAN.md` (`TS-UNIT-04` through `TS-UNIT-13`)
7. `16_DECISION_LOG.md` (ADL-01: Table-I Row 5 6.0 mm, ADL-07: Temporal Epochs, ADL-12: 4-State Triage)
8. `10_SECURITY_AND_AUDIT_SPECIFICATION.md` (Section 2: Legal Compliance & Compounding Boundaries)

---

## 4. What inputs do I use?
- `NormalizedCommodityFacts` from `backend/contracts/extraction/extraction_dto.py`.
- Physical font height measurements from `backend/contracts/calibration/calibration_dto.py`.
- Standalone rule fixtures in `backend/rule_engine/fixtures/`.

---

## 5. What outputs do I produce?
- `ComplianceVerdictResult` conforming to `backend/contracts/compliance/compliance_dto.py` with granular `RuleEvaluationDTO` list citing exact Gazette GSR notifications.

---

## 6. What contract do I follow?
- `backend/contracts/compliance/compliance_dto.py` and `backend/contracts/compliance/compliance_schema.json`.

---

## 7. How do I run my module?
```bash
python -m backend.rule_engine.engine
```

---

## 8. How do I run tests?
```bash
pytest backend/rule_engine/tests/ -v
```

---

## 9. What counts as complete?
Your module is complete when:
1. Table-I schedule enforces exact thresholds, specifically verifying Row 5 at 6.0 mm.
2. USP arithmetic validator flags discrepancies $> 0.02$.
3. Temporal Epoch Dispatcher correctly applies non-retroactive statutory snapshots.
4. E-commerce auditor respects Rule 6(10) manufacturing date exemption.
5. 4-State epistemic triage routes borderline cases without forcing false binary decisions.
6. All unit tests pass with $> 95\%$ coverage.
7. `progress.md` is marked `COMPLETE — YYYY-MM-DD HH:MM IST`.
8. `memory.md` is updated.

---

## 10. What must I NOT depend on?
- You must NOT depend on Member 1's camera code or Member 3's regex parser.
- Use static extraction and calibration fixtures!
Your module executes 100% deterministically in pure Python!

---

## 11. Workstream Sign-off & Verification
- **Lead Engineer:** **Ambika Bansal** ([@bansalambika12-ship-it](https://github.com/bansalambika12-ship-it))
- **Verification Status:** 100% Passing (53/53 tests passing in 1.27s)
- **Delivered Subsystems:** Deterministic AST Statutory Rule Engine, Table-I Font Schedule, USP Arithmetic Verification, Rule 6(1)(k) Proviso & 4-State Epistemic Triage

