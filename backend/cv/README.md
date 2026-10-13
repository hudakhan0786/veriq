# Member 1 — Computer Vision, Optics & Metrology

**Assigned Engineer:** **Kunal Raj** ([@kunal-raj-dev](https://github.com/kunal-raj-dev))  
**Assigned Workstream:** Optical Quality Gate, Scale Calibration, Planar Homography, Packaging Geometry & PDP Measurement  
**Assigned Folder:** `backend/cv/`  
**Git Feature Branch:** `feat/m1-cv-metrology`  

---

## 1. What is my job?
Your job is to build the computer vision and optical measurement foundation for Nirikshak.
You ensure that incoming images are sharp, free of severe glare bloom, and properly aligned.
You detect reference calibration markers (ArUco 4x4_50 or ISO 7810 card), compute the planar homography matrix to remove perspective tilt, derive the physical metric scale ($S = \text{pixels per mm}$), and calculate the Principal Display Panel (PDP) surface area in cm².

---

## 2. What files am I allowed to change?
You are allowed to create and edit files strictly inside:
- `backend/cv/**`

You may read shared contracts in `backend/contracts/quality_gate/` and `backend/contracts/calibration/`.
You must NOT edit other member directories or root specification files.

---

## 3. What documents must I read?
1. `AGENTS.md` (Root team rules)
2. `01_MASTER_PROJECT_BLUEPRINT.md`
3. `03_FINAL_ARCHITECTURE.md` (Stages 1 through 5)
4. `05_TECHNOLOGY_DECISION_RECORD.md` (ADR-06: ArUco Fiducials & Homography)
5. `07_API_AND_INTERFACE_CONTRACTS.md` (`QualityCheckDTO`, `CalibrationDTO`, `/api/v1/inspections/upload`)
6. `11_TESTING_AND_VALIDATION_PLAN.md` (`TS-CALIB-01`, `TS-CALIB-02`, `TS-OPTIC-01`, `TS-OPTIC-02`)
7. `16_DECISION_LOG.md` (ADL-03, ADL-17)
8. `17_OPEN_QUESTIONS.md` (OQ-01, OQ-04)
9. `10_SECURITY_AND_AUDIT_SPECIFICATION.md` (Section 1: Optical & Measurement Guardrails)

---

## 4. What inputs do I use?
- High-resolution packaging images ($\ge 1920 \times 1080$, JPEG/PNG).
- Standard fiducial markers in the scene: ArUco 4x4_50 ($50.0\text{ mm}$) or ISO 7810 ID-1 card ($85.60 \times 53.98\text{ mm}$).
- Standalone test fixtures in `backend/cv/fixtures/`.

---

## 5. What outputs do I produce?
- `QualityCheckDTO` / `QualityGateResult` JSON containing blur score, glare percentage, tilt angle, and pass/fail flag.
- `CalibrationDTO` / `CalibrationResult` JSON containing calibration method, `px_to_mm` scale factor, confidence, PDP area in cm², and homography matrix.

---

## 6. What contract do I follow?
- `backend/contracts/quality_gate/quality_gate_dto.py`
- `backend/contracts/calibration/calibration_dto.py`

---

## 7. How do I run my module?
```bash
# Generate synthetic test fixtures
python backend/cv/fixtures/generate_fixtures.py

# Run accuracy and latency benchmark harness
python backend/cv/benchmark.py

# Run end-to-end CV pipeline on an image frame
python backend/cv/pipeline_cv.py
```

---

## 8. How do I run tests?
```bash
# Run Member 1 tests standalone (43 tests)
python -m pytest backend/cv/tests/ -v

# Run entire repository test suite (69 tests)
python -m pytest -v
```

---

## 9. Key Documentation & Artifacts
- **Handoff Specification:** `MEMBER_1_HANDOFF.md` (APIs, guarantees, integration examples).
- **Final Validation Report:** `FINAL_VALIDATION_REPORT.md` (31-section comprehensive validation audit).
- **Permanent Working Memory:** `memory.md` (Architectural discoveries and decisions).
- **Progress Tracking:** `progress.md` (Timestamped signed off execution entries).

---

## 10. What counts as complete?
Your module is complete when:
1. Laplacian blur estimator correctly rejects images with $\sigma^2 < 150$.
2. Glare detector correctly flags specular highlights $> 3\%$.
3. Planar homography rectifies perspective tilt up to $15^\circ$.
4. Metric scale MAE is $\le 0.15\text{ mm}$ on synthetic targets (achieved: $0.0051\text{ mm}$).
5. CPU pipeline latency is $\le 80\text{ ms}$ (achieved: $45.76\text{ ms}$ mean / $58.46\text{ ms}$ p95).
6. All 43 Member 1 unit tests pass and all 69 repository tests pass.
7. `progress.md` is marked `COMPLETE` with verified signature block.
8. `memory.md` is updated.

---

## 11. What must I NOT depend on?
- You must NOT depend on Member 2's OCR engine.
- You must NOT depend on Member 3's regex extractor.
- You must NOT depend on Member 4's legal rules.
- You must NOT depend on Member 5's database or PDF generator.
- You must NOT depend on Member 6's web UI.
Your module runs completely on standalone image fixtures!
