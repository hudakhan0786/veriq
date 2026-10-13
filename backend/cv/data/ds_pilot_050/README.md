# DS-PILOT-050: Empirical FMCG Physical Testbed (Member 1 Infrastructure)

## Overview
Under `06_DATA_AND_MODEL_STRATEGY.md` and `16_DECISION_LOG.md` (ADL-17), `DS-PILOT-050` defines the physical testbed of 50 commercially procured Indian FMCG packages measured with physical digital vernier calipers ($\pm 0.02\text{ mm}$ accuracy) serving as the evaluation gold standard for field inspections.

## Calibration & Measurement Protocol
1. **Packaging Categories (50 SKUs):**
   - Category 1: Food & Snacks (15 pkgs - flexible pouches, metallic foil)
   - Category 2: Beverages (10 pkgs - cylindrical PET bottles, glass jars)
   - Category 3: Cosmetics (10 pkgs - tiny PDP $< 10\text{ cm}^2$, small fonts)
   - Category 4: Personal Care (8 pkgs - transparent bottles, crimped tubes)
   - Category 5: Commodities (7 pkgs - corrugated cartons, bulk sacks)

2. **Physical Tooling:**
   - Mitutoyo Digital Vernier Caliper ($\pm 0.02\text{ mm}$) for character x-height and line spacing.
   - Certified Steel Ruler ($\pm 0.5\text{ mm}$) for PDP container dimensions.
   - High-resolution camera captures with coplanar 50.0 mm ArUco 4x4_50 reference card.

3. **Status:**
   - Benchmark harness and schema fully operational.
   - Physical pilot data collection requires on-site procurement and caliper measurement.
   - All physical entries must be recorded in `pilot_manifest.json` following the schema below.
