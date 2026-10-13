"""Deterministic Synthetic Test Fixture Generator (SIH26034 - Nirikshak)
Member 1 — Computer Vision, Optics & Metrology
Generates reproducible test images for Optical Quality Gate, Calibration, and Packaging Geometry.
"""

from pathlib import Path
import numpy as np
import cv2

FIXTURES_DIR = Path(__file__).resolve().parent

# Deterministic dimensions
CANVAS_W = 1920
CANVAS_H = 1080


def create_base_packaging_label(w: int = CANVAS_W, h: int = CANVAS_H) -> np.ndarray:
    """Creates a sharp, high-contrast synthetic packaging scene."""
    img = np.full((h, w, 3), 230, dtype=np.uint8)

    # Packaging container boundary (Cardboard / Carton)
    # Box rectangle: x from 400 to 1520 (width 1120), y from 140 to 940 (height 800)
    box_color = (210, 225, 245)  # Light kraft/cream in BGR
    cv2.rectangle(img, (400, 140), (1520, 940), box_color, -1)
    cv2.rectangle(img, (400, 140), (1520, 940), (30, 50, 100), 4)

    # Brand banner
    cv2.rectangle(img, (420, 160), (1500, 280), (180, 50, 20), -1)
    cv2.putText(
        img,
        "BHARAT ORGANICS - PREMIUM PACKAGING",
        (450, 240),
        cv2.FONT_HERSHEY_DUPLEX,
        1.6,
        (255, 255, 255),
        3,
        cv2.LINE_AA,
    )

    # High-contrast statutory text blocks
    text_lines = [
        ("COMMODITY: Organic Whole Wheat Flour", (450, 360), 1.2, (20, 20, 20), 2),
        ("NET QUANTITY: 500 g", (450, 440), 1.6, (10, 10, 10), 3),
        ("MAXIMUM RETAIL PRICE: Rs. 65.00 (incl. of all taxes)", (450, 520), 1.4, (10, 10, 10), 3),
        ("UNIT SALE PRICE: Rs. 0.13 / g", (450, 590), 1.1, (30, 30, 30), 2),
        ("MFG DATE: 15/08/2026   EXPIRY DATE: 14/02/2027", (450, 660), 1.1, (30, 30, 30), 2),
        ("MFG BY: Bharat Organics Ltd, Industrial Area, Phase-II, New Delhi - 110020", (450, 730), 0.9, (40, 40, 40), 2),
        ("CONSUMER CARE: support@bharatorganics.in | Tel: 1800-11-2233", (450, 790), 0.9, (40, 40, 40), 2),
        ("COUNTRY OF ORIGIN: INDIA", (450, 850), 1.2, (10, 10, 10), 3),
    ]

    for text, origin, scale, color, thick in text_lines:
        cv2.putText(img, text, origin, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)

    # Barcode pattern on the bottom right
    for i in range(40):
        bx = 1250 + i * 5
        bw = 2 if i % 3 == 0 else (3 if i % 5 == 0 else 1)
        cv2.line(img, (bx, 750), (bx, 880), (10, 10, 10), bw)

    return img


def generate_clear_fixture() -> Path:
    """Generates sharp clear packaging image passing all optical criteria."""
    img = create_base_packaging_label()
    out_path = FIXTURES_DIR / "fixture_quality_gate_clear.png"
    cv2.imwrite(str(out_path), img)
    return out_path


def generate_blurred_fixture() -> Path:
    """Generates motion/defocus blurred packaging image failing blur threshold."""
    img = create_base_packaging_label()
    # Apply severe Gaussian blur (simulating camera shake / out of focus)
    blurred = cv2.GaussianBlur(img, (35, 35), 14.0)
    out_path = FIXTURES_DIR / "fixture_quality_gate_blurred.png"
    cv2.imwrite(str(out_path), blurred)
    return out_path


def generate_glared_fixture() -> Path:
    """Generates packaging image with severe specular reflection bloom failing glare threshold."""
    img = create_base_packaging_label()
    h, w = img.shape[:2]

    # Create a large specular glare bloom (V > 245, S < 15)
    # Glare hotspot covering ~5.5% of the frame (above the 3.0% threshold)
    # Total pixels = 1920*1080 = 2,073,600. 5.5% = ~114,000 pixels.
    # A circle of radius 195 has area ~ 119,400 pixels (~5.75%)
    glare_center = (960, 500)
    radius = 200

    # Draw bright specular bloom with gradient falloff
    overlay = img.copy()
    cv2.circle(overlay, glare_center, radius, (255, 255, 255), -1)
    # Add a secondary intense reflection oval
    cv2.ellipse(overlay, (920, 480), (160, 100), 30, 0, 360, (255, 255, 255), -1)

    # Blend slightly to create realistic bloom edges
    alpha = 0.95
    cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0, img)
    # Ensure core glare pixels are pure white (V=255, S=0)
    cv2.circle(img, glare_center, int(radius * 0.85), (255, 255, 255), -1)

    out_path = FIXTURES_DIR / "fixture_quality_gate_glare.png"
    cv2.imwrite(str(out_path), img)
    return out_path


def generate_tilted_fixture() -> Path:
    """Generates packaging image with perspective tilt > 15 deg failing tilt threshold."""
    img = create_base_packaging_label()
    h, w = img.shape[:2]

    # Perspective transformation simulating ~22 degree camera tilt
    src_pts = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    dst_pts = np.float32([
        [w * 0.12, h * 0.05],
        [w * 0.88, h * 0.15],
        [w * 0.98, h * 0.92],
        [w * 0.02, h * 0.85],
    ])

    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    tilted = cv2.warpPerspective(img, matrix, (w, h), borderValue=(220, 220, 220))

    out_path = FIXTURES_DIR / "fixture_quality_gate_tilted.png"
    cv2.imwrite(str(out_path), tilted)
    return out_path


def generate_calibration_aruco_fixture() -> Path:
    """Generates packaging scene with official ArUco 4x4_50 marker for calibration."""
    img = create_base_packaging_label()

    # Generate 50mm ArUco marker ID 0 (from 4x4_50 dictionary)
    # At 10.0 pixels/mm, a 50mm marker is 500x500 pixels
    # For a realistic scene, place a 250x250 marker (5.0 px/mm)
    dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    marker_size_px = 250
    marker_img = cv2.aruco.generateImageMarker(dictionary, 0, marker_size_px)

    # Convert marker to 3-channel
    marker_bgr = cv2.cvtColor(marker_img, cv2.COLOR_GRAY2BGR)

    # Place marker on top-left of packaging with white quiet zone
    pad = 25
    padded_marker = cv2.copyMakeBorder(
        marker_bgr, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(255, 255, 255)
    )

    # Overlay onto packaging scene at (60, 200)
    mh, mw = padded_marker.shape[:2]
    img[200 : 200 + mh, 60 : 60 + mw] = padded_marker

    out_path = FIXTURES_DIR / "fixture_calibration_aruco.png"
    cv2.imwrite(str(out_path), img)
    return out_path


def generate_calibration_iso_card_fixture() -> Path:
    """Generates packaging scene with ISO 7810 ID-1 card (85.60 x 53.98 mm) fallback."""
    img = create_base_packaging_label()

    # Card dimensions: 85.60 mm x 53.98 mm -> aspect ratio ~ 1.5858
    # At 4.0 px/mm: width = 342 px, height = 216 px
    card_w = 342
    card_h = 216
    cx = 80
    cy = 250

    # Draw white card with dark border and text
    cv2.rectangle(img, (cx, cy), (cx + card_w, cy + card_h), (250, 250, 250), -1)
    cv2.rectangle(img, (cx, cy), (cx + card_w, cy + card_h), (50, 50, 50), 3)
    cv2.putText(
        img,
        "STANDARD REFERENCE CARD",
        (cx + 20, cy + 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (40, 40, 40),
        2,
    )
    cv2.putText(
        img,
        "ISO 7810 ID-1 (85.6 x 54.0 mm)",
        (cx + 20, cy + 120),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (80, 80, 80),
        1,
    )

    out_path = FIXTURES_DIR / "fixture_calibration_iso_card.png"
    cv2.imwrite(str(out_path), img)
    return out_path


def generate_all_fixtures() -> dict:
    """Generates all synthetic fixtures deterministically."""
    FIXTURES_DIR.mkdir(parents=True, exist_ok=True)
    generated = {
        "clear": generate_clear_fixture(),
        "blurred": generate_blurred_fixture(),
        "glared": generate_glared_fixture(),
        "tilted": generate_tilted_fixture(),
        "aruco": generate_calibration_aruco_fixture(),
        "iso_card": generate_calibration_iso_card_fixture(),
    }
    return generated


if __name__ == "__main__":
    results = generate_all_fixtures()
    print("Synthetic fixtures generated successfully:")
    for key, path in results.items():
        print(f"  [{key}]: {path} ({path.stat().st_size} bytes)")
