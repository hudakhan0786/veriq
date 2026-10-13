# Member 2 OCR Models Directory

This directory houses the frozen neural weights and vocabularies for the SIH26034 Multilingual OCR & Text Detection pipeline.

## Licenses & IP Compliance
All models and vocabulary artifacts in this directory are governed by permissive, audit-approved open-source licenses (**Apache-2.0** / **MIT**).
Zero AGPL-3.0 copyleft code or models are utilized.

## Model Manifest

| Artifact File | Role | Source / Architecture | License | Size (Bytes) | SHA-256 Checksum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ch_PP-OCRv4_det.onnx` | Stage 6: Multi-oriented Text Detector | DBNet++ (PaddleOCR v4 Det ONNX) | Apache-2.0 | 4,745,517 | `30a86f5731181461d08021402766601e4302a9b9b9666be8aff402696339cdff` |
| `en_PP-OCRv4_rec_infer.onnx` | Stage 7: English Text Recognizer | PP-OCRv4 Latin Rec ONNX | Apache-2.0 | 7,656,802 | `5ca59a096cf493d5fd5044b9ccc1bdea9229fbcf656bd76040ff80a00201ee16` |
| `en_dict.txt` | English CTC Vocabulary | PaddleOCR English Dictionary (95 chars) | Apache-2.0 | 285 | `f27a6aa993c9cb67a588e7ea9aea90bb96b8e51dec6ce98bd7e76c104c1829fe` |
| `devanagari_PP-OCRv4_rec.onnx` | Stage 7: Devanagari Hindi Text Recognizer | PP-OCRv3 Devanagari Rec ONNX (PaddleOCR Upstream) | Apache-2.0 | 7,935,595 | `2e895a63a7e08932c8b7b65d8bdb87f96b6f075a80c329ab98298ea0915ebf85` |
| `devanagari_dict.txt` | Devanagari CTC Vocabulary | PaddleOCR Devanagari Dictionary (568 chars) | Apache-2.0 | 1,943 | `09c7440bfc5477e5c41052304b6b185aff8c4a5e8b2b4c23c1c706f6fe1ee9fc` |
| `eng.traineddata` | Secondary Consensus Fallback | Tesseract v5 English Fast LSTM | Apache-2.0 | 4,113,088 | `7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2` |
| `hin.traineddata` | Secondary Consensus Fallback | Tesseract v5 Hindi Fast LSTM | Apache-2.0 | 1,122,751 | `4c73ffc59d497c186b19d1e90f5d721d678ea6b2e277b719bee4e2af12271825` |

## Model Tensor Signatures

### 1. DBNet++ Text Detector (`ch_PP-OCRv4_det.onnx`)
- **Input:** `x` shape `[1, 3, H, W]`, dtype `float32`, normalized by ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`. H and W must be multiples of 32.
- **Output:** `sigmoid_0.tmp_0` shape `[1, 1, H, W]`, dtype `float32`, representing binary text probability map in [0.0, 1.0].
- **Post-processing:** Thresholded at 0.3, Vatti polygon expansion ratio 1.5 via Pyclipper, minimum box score 0.6.

### 2. PP-OCRv4 English Recognizer (`en_PP-OCRv4_rec_infer.onnx`)
- **Input:** `x` shape `[batch, 3, 48, W]`, dtype `float32`, normalized via (x/255.0 - 0.5) / 0.5.
- **Output:** `softmax_2.tmp_0` shape `[batch, time_steps, 97]`, dtype `float32`, representing CTC softmax probability distribution.
- **Vocabulary:** 97 classes: Index 0 is `<blank>`, Indices 1..95 from `en_dict.txt`, Index 96 is space `' '`.

### 3. Devanagari Hindi Recognizer (`devanagari_PP-OCRv4_rec.onnx` — PP-OCRv3 Devanagari Rec)
- **Upstream Identity:** `devanagari_PP-OCRv3_rec_infer` from official PaddleOCR multilingual release. (Upstream PaddleOCR never released a v4 model for Devanagari; official multilingual releases for Indic scripts remain on the proven PP-OCRv3 architecture).
- **Input:** `x` shape `[batch, 3, 48, W]`, dtype `float32`, normalized via (x/255.0 - 0.5) / 0.5.
- **Output:** `fetch_name_0` shape `[batch, time_steps, 570]`, dtype `float32`, representing CTC softmax probability distribution.
- **Vocabulary:** 570 classes: Index 0 is `<blank>`, Indices 1..568 from `devanagari_dict.txt`, Index 569 is space `' '`.

## Deterministic Provisioning
Run the provisioning script to download and verify all models:
```bash
python backend/ocr/scripts/download_models.py --verify
```
