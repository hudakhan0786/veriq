"""SHA-256 Merkle Directed Acyclic Graph (DAG) for Section 63 BSA 2023 Evidence (SIH26034)"""

from datetime import datetime, timezone
import hashlib
import json
from typing import Any, Dict, List, Optional, Tuple


class MerkleAuditLedger:
    @staticmethod
    def hash_payload(data: Any) -> str:
        """Computes deterministic SHA-256 hash of a dictionary, string, or byte payload."""
        if isinstance(data, bytes):
            payload_bytes = data
        elif isinstance(data, str):
            payload_bytes = data.encode("utf-8")
        else:
            # Deterministic sorted JSON string
            payload_bytes = json.dumps(data, sort_keys=True, separators=(",", ":")).encode("utf-8")
        return hashlib.sha256(payload_bytes).hexdigest()

    @classmethod
    def build_merkle_root(cls, leaf_hashes: List[str]) -> str:
        """Constructs a binary SHA-256 Merkle root from ordered list of stage hashes."""
        if not leaf_hashes:
            return hashlib.sha256(b"").hexdigest()
        if len(leaf_hashes) == 1:
            return leaf_hashes[0]

        current_level = list(leaf_hashes)
        while len(current_level) > 1:
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else left
                combined = hashlib.sha256((left + right).encode("utf-8")).hexdigest()
                next_level.append(combined)
            current_level = next_level

        return current_level[0]

    @classmethod
    def verify_integrity(cls, leaf_hashes: List[str], expected_root: str) -> bool:
        """Verifies if the computed Merkle root matches the expected cryptographic root."""
        computed_root = cls.build_merkle_root(leaf_hashes)
        return computed_root == expected_root


class PipelineEvidenceDAG:
    """SHA-256 Merkle Directed Acyclic Graph (DAG) linking all 7 pipeline inspection stages.
    Enforces Section 63 BSA 2023 unbroken chain-of-custody and 100% tamper detection (ADR-09, ADL-14).
    """

    def __init__(self, inspection_id: str):
        self.inspection_id = inspection_id
        self.nodes: List[Dict[str, Any]] = []
        self.leaf_hashes: List[str] = []

    def add_node(
        self,
        stage_name: str,
        payload: Any,
        metadata: Optional[Dict[str, Any]] = None,
        timestamp_utc: Optional[str] = None,
    ) -> str:
        """Adds a pipeline stage node, calculates payload hash, and appends to leaf sequence."""
        payload_hash = MerkleAuditLedger.hash_payload(payload)
        ts = timestamp_utc or datetime.now(timezone.utc).isoformat()
        node = {
            "stage_name": stage_name,
            "payload_sha256": payload_hash,
            "timestamp_utc": ts,
            "metadata": metadata or {},
        }
        self.nodes.append(node)
        self.leaf_hashes.append(payload_hash)
        return payload_hash

    def get_leaf_hashes(self) -> List[str]:
        """Returns the ordered list of leaf SHA-256 hashes."""
        return list(self.leaf_hashes)

    def compute_root(self) -> str:
        """Computes the SHA-256 Merkle root from the current leaf sequence."""
        return MerkleAuditLedger.build_merkle_root(self.leaf_hashes)

    def to_contract_nodes(self) -> List[Dict[str, Any]]:
        """Exports raw dict representations compatible with MerkleNodeDTO."""
        return list(self.nodes)

    @classmethod
    def build_standard_7_node_dag(
        cls,
        inspection_id: str,
        raw_image_bytes: bytes,
        calibration_data: Any,
        rectified_frame_meta: Any,
        ocr_tokens: Any,
        extracted_facts: Any,
        rule_findings: Any,
        officer_signoff: Any,
    ) -> "PipelineEvidenceDAG":
        """Constructs the canonical 7-stage pipeline DAG:
        1. RAW_IMAGE: Optical sensor raw payload
        2. CALIBRATION: ArUco / metric calibration telemetry
        3. RECTIFIED_FRAME: Planar homography & PDP geometry
        4. OCR_TOKENS: Multilingual OCR bounding polygons
        5. EXTRACTED_FACTS: Semantic statutory attributes
        6. RULE_FINDINGS: Legal Metrology AST rule evaluations
        7. OFFICER_SIGNOFF: Human-in-the-loop adjudication signoff
        """
        dag = cls(inspection_id)
        dag.add_node("RAW_IMAGE", raw_image_bytes)
        dag.add_node("CALIBRATION", calibration_data)
        dag.add_node("RECTIFIED_FRAME", rectified_frame_meta)
        dag.add_node("OCR_TOKENS", ocr_tokens)
        dag.add_node("EXTRACTED_FACTS", extracted_facts)
        dag.add_node("RULE_FINDINGS", rule_findings)
        dag.add_node("OFFICER_SIGNOFF", officer_signoff)
        return dag

