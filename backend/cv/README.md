# VERIQ — Computer Vision, Optics & Metrology

**Module:** Member 1 — Optical Quality Gate, Scale Calibration, Planar Homography & PDP Measurement  
**Assigned Engineer:** Mohammed Zeeshan (`@ZMICS`)  
**Git Branch:** `feat/m1-cv-metrology`  
**Directory:** `backend/cv/`

---

## 1. Overview

The VERIQ Computer Vision (CV) module validates packaging images, checks image quality, calibrates physical scale using a known reference, and measures the Principal Display Panel (PDP) area.

It is designed as an independent backend module that can later integrate with VERIQ's shared contracts and the main application pipeline.

### Responsibilities

- Validate supported image formats and minimum resolution.
- Detect excessive blur using the variance of the Laplacian.
- Estimate glare as a percentage of image pixels.
- Detect and use a known physical reference for calibration:
  - ArUco `4x4_50` marker with a 50 mm reference dimension.
  - ISO/IEC 7810 ID-1 card measuring 85.60 × 53.98 mm.
- Compute a planar homography for perspective correction.
- Calculate metric scale in pixels per millimetre.
- Measure PDP surface area in square centimetres.
- Provide standalone tests, fixtures, and a benchmark entry point.

### Out of Scope

This module does not implement:

- OCR or text extraction.
- Regex-based label parsing.
- Regulatory or legal-compliance decisions.
- Database persistence.
- PDF report generation.
- Frontend or UI functionality.

---

## 2. Module Architecture

The intended processing flow is:

```text
Input Packaging Image
          |
          v
Image Loading and Validation
          |
          v
Quality Gate
  - Resolution
  - Blur
  - Glare
          |
          v
Reference Detection
  - ArUco Marker
  - ISO ID-1 Card
          |
          v
Scale Calibration
  - Perspective Geometry
  - Planar Homography
  - Pixels per Millimetre
          |
          v
PDP Measurement
  - PDP Corner Coordinates
  - Physical Area in cm²
          |
          v
Structured CV Result
```

A failed quality gate should prevent downstream measurement unless the application explicitly defines another safe handling path.

---

## 3. Directory Structure

```text
backend/
├── contracts/
│   ├── quality_gate/
│   │   └── quality_gate_dto.py
│   └── calibration/
│       └── calibration_dto.py
│
└── cv/
    ├── __init__.py
    ├── README.md
    ├── requirements.txt
    ├── models.py
    ├── quality_gate.py
    ├── calibration.py
    ├── pipeline_cv.py
    ├── benchmark.py
    ├── progress.md
    ├── memory.md
    ├── fixtures/
    │   └── generate_fixtures.py
    └── tests/
        └── test_cv.py
```

The exact files may change as the implementation is integrated with the repository's shared contracts.

---

## 4. Requirements

- Python 3.10 or newer recommended.
- NumPy.
- OpenCV with ArUco support.
- Pytest for testing.

Install the dependencies from the repository root:

```bash
python -m pip install -r backend/cv/requirements.txt
```

If the project uses a virtual environment, activate it before installing dependencies.

---

## 5. Image Quality Gate

The quality gate checks whether an image is suitable for downstream measurement.

### Supported inputs

- JPEG/JPG
- PNG
- Minimum target resolution: 1920 × 1080 pixels

### Blur detection

Blur is estimated using the variance of the Laplacian:

```python
blur_score = cv2.Laplacian(
    grayscale_image,
    cv2.CV_64F
).var()
```

The configured rejection threshold is:

```text
Reject when blur_score < 150
```

This is a configurable heuristic, not a universal image-quality standard. Its suitability should be validated against representative packaging images and camera conditions.

### Glare detection

Glare is estimated from pixels meeting the implementation's bright, low-saturation criteria.

The configured target is:

```text
Reject when estimated glare exceeds 3% of image pixels
```

The estimate can be affected by white packaging, reflective materials, exposure, and lighting. Validate the threshold on real images before using it in production.

### Quality-gate output

The quality gate should communicate:

- Whether the image passed.
- Image dimensions.
- Blur score.
- Estimated glare percentage.
- Rejection reasons, if any.

Do not interpret a passing quality gate as proof that the image is suitable for every measurement task.

---

## 6. Scale Calibration

The module supports two types of physical references.

### Option A: ArUco Marker

- Dictionary: `DICT_4X4_50`
- Reference dimension: 50 mm, according to the configured marker specification.
- The detected marker corners provide reference geometry for calibration.

Ensure that the printed marker's actual dimensions match the configured physical size. Marker border conventions and printing scale must be handled consistently.

### Option B: ISO/IEC 7810 ID-1 Card

Configured dimensions:

```text
Width:  85.60 mm
Height: 53.98 mm
```

The card can provide a known rectangular reference for estimating the image-to-plane transformation.

Contour-based card detection is heuristic and may fail when the card is occluded, poorly lit, rotated, or visually similar to surrounding objects.

### Calibration outputs

The calibration stage should provide:

- Detected reference type.
- Reference corner coordinates.
- Homography matrix.
- Estimated scale in pixels per millimetre.
- Calibration status and diagnostic information.

Calibration confidence values, if returned, are heuristic unless they have been statistically calibrated against a labelled validation dataset.

---

## 7. Planar Homography

A homography maps points between two views of the same plane.

For corresponding image and reference points:

```python
H = cv2.getPerspectiveTransform(
    source_points,
    destination_points
)
```

The implementation can use the resulting transformation to rectify a planar packaging surface into a canonical coordinate system.

### Important assumptions

- The reference and the measured PDP lie on the same plane.
- The reference corners are detected accurately.
- The physical reference dimensions are correct.
- The image has sufficient detail and limited distortion.
- The measured surface is approximately planar.

A homography cannot reliably correct arbitrary three-dimensional shape, severe lens distortion, or a PDP that is not coplanar with the calibration reference.

The target is to handle perspective distortion, including moderate viewing angles such as 15 degrees, subject to validation on representative test images.

---

## 8. PDP Area Measurement

The Principal Display Panel (PDP) is the packaging surface intended to be measured.

The measurement stage uses PDP corner coordinates and the calibrated plane to estimate physical area.

The intended output unit is:

```text
cm²
```

### Measurement requirements

1. Establish the PDP boundary.
2. Transform the boundary into calibrated planar coordinates.
3. Calculate the polygon area.
4. Convert the area from mm² to cm² when the calibrated coordinates are in millimetres.

Conversion:

```text
1 cm² = 100 mm²
```

### Current implementation limitation

The current scaffold expects PDP corner coordinates to be supplied by the caller. It does not independently detect the PDP boundary from an arbitrary packaging image.

Therefore, PDP area accuracy depends on the correctness of the supplied corners and the calibration transformation.

---

## 9. Running the Module

Run commands from the repository root.

### Generate test fixtures

```bash
python backend/cv/fixtures/generate_fixtures.py
```

This creates synthetic images for exercising the quality-gate logic. Synthetic fixtures are useful for deterministic tests but do not replace real-world validation.

### Run the CV pipeline

```bash
python backend/cv/pipeline_cv.py
```

Check the script's CLI help or implementation for the available arguments and input format.

### Run module tests

```bash
python -m pytest backend/cv/tests/ -v
```

### Run the complete repository test suite

```bash
python -m pytest -v
```

The full repository test suite may require additional dependencies beyond those listed in this module.

### Run the benchmark

```bash
python backend/cv/benchmark.py
```

Review the benchmark implementation before interpreting its results. A benchmark that measures only quality checks does not establish end-to-end pipeline latency.

---

## 10. Performance and Validation Targets

The following are intended targets and acceptance criteria. They must not be reported as achieved results unless they have been reproduced using the current code and documented test environment.

| Metric | Target |
|---|---|
| Minimum image resolution | 1920 × 1080 |
| Blur rejection threshold | Laplacian variance < 150 |
| Glare rejection threshold | Estimated glare > 3% |
| Perspective correction | Validate at viewing angles up to approximately 15° |
| Scale calibration MAE | ≤ 0.15 mm |
| End-to-end processing latency | ≤ 80 ms |

Any previously quoted benchmark values, including calibration error, mean latency, p95 latency, or test totals, should be treated as unverified until the benchmark and tests are run against the current implementation.

For meaningful latency measurements, document the hardware, image dimensions, number of iterations, warm-up procedure, and whether image loading and reference detection are included.

---

## 11. Testing Strategy

Testing should cover the following categories.

### Quality-gate tests

- Valid JPEG and PNG images.
- Unsupported file types.
- Missing or unreadable images.
- Images below the minimum resolution.
- Blurred images.
- Images with synthetic glare.
- Images that pass all configured checks.

### Calibration tests

- Valid ArUco marker detection.
- Missing or invalid markers.
- ISO ID-1 card detection.
- Perspective-distorted reference images.
- Incorrect or degenerate corner coordinates.
- Known-scale measurements.
- Homography transformation consistency.

### PDP measurement tests

- Rectangular PDPs with known dimensions.
- Polygon-area calculations.
- Unit conversion from mm² to cm².
- Invalid or degenerate polygons.
- Sensitivity to inaccurate boundary coordinates.

### Integration tests

- Quality-gate failure prevents normal downstream measurement.
- Calibration failure is represented clearly.
- Missing reference geometry produces an explicit failure.
- Structured outputs contain the required fields.
- Shared DTO contracts are respected.

---

## 12. Shared Contract Integration

The repository's shared contracts are located at:

```text
backend/contracts/quality_gate/quality_gate_dto.py
backend/contracts/calibration/calibration_dto.py
```

Read these definitions before integrating the CV module with the rest of VERIQ.

The module's local dataclasses are implementation-level models. They must be adapted to the repository's shared DTOs where required.

Do not silently introduce conflicting field names, units, status values, or serialization formats.

Keep physical units explicit in field names or documentation. For example, distinguish millimetres from pixels and square centimetres from square millimetres.

---

## 13. Required Project Documentation

Before finalizing the workstream, read the applicable project specifications:

- `AGENTS.md`
- `01_MASTER_PROJECT_BLUEPRINT.md`
- `03_FINAL_ARCHITECTURE.md` — stages 1–5
- `05_TECHNOLOGY_DECISION_RECORD.md` — ADR-06
- `07_API_AND_INTERFACE_CONTRACTS.md`
- `11_TESTING_AND_VALIDATION_PLAN.md` — TS-CAL-01/02 and TS-OPTIC-01/02
- `16_DECISION_LOG.md` — ADL-03/17
- `17_OPEN_QUESTIONS.md` — OQ-01/04
- `10_SECURITY_AND_AUDIT_SPECIFICATION.md` — section 1

Use the actual repository documents as the source of truth. If this README conflicts with an approved specification or shared contract, follow the authoritative project documentation and update this README.

---

## 14. Security and Reliability

- Treat uploaded images as untrusted input.
- Validate file types and image dimensions before expensive processing.
- Handle malformed and unreadable files without crashing the application.
- Avoid logging sensitive image data or unnecessary filesystem paths.
- Do not treat a successful calibration as a legal-compliance decision.
- Return explicit failure states when the reference cannot be detected.
- Do not report physical measurements as reliable when calibration assumptions are violated.
- Keep temporary fixture and output files within the designated project directories.
- Do not modify another member's modules or shared specifications without authorization.

---

## 15. Team Responsibilities

| Team member | Workstream |
|---|---|
| Arooba Hasan | Frontend |
| Huda Khan | Full stack |
| Mohammed Zeeshan (`@ZMICS`) | Backend CV, optics and metrology |

The CV module should expose a stable, documented interface so other workstreams can integrate it without depending on internal implementation details.

---

## 16. Scope Restrictions

The assigned working directory is:

```text
backend/cv/
```

The assigned Git branch is:

```text
feat/m1-cv-metrology
```

Only modify files under `backend/cv/` for this workstream unless the project owner explicitly authorizes another change.

Shared contracts may be read for integration, but do not modify other members' directories or root-level specifications as part of this assignment.

---

## 17. Completion Checklist

- [ ] Read all required project specifications.
- [ ] Confirm the shared DTO field names and units.
- [ ] Implement and validate image-quality checks.
- [ ] Validate ArUco reference detection.
- [ ] Validate ISO ID-1 card detection.
- [ ] Validate homography and scale calibration using known dimensions.
- [ ] Validate PDP area measurement against known geometry.
- [ ] Run the fixture generator.
- [ ] Run the module test suite.
- [ ] Run the repository-wide test suite.
- [ ] Run and document the benchmark.
- [ ] Verify error handling and failure states.
- [ ] Update progress and implementation notes with reproducible results.
- [ ] Confirm all changes remain within the assigned workstream.
- [ ] Commit the validated work on `feat/m1-cv-metrology`.

**Status:** Treat the module as a scaffold until the checklist has been completed and the results have been reproduced. Do not claim production readiness or verified performance solely because the files exist.