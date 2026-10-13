"""Nirikshak (SIH26034) — Production Monolith Application Server.
Orchestrates FastAPI REST API (Mode A & B), Central Pipeline, and React 18 Production Web App.
Governed by Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023).
"""

import os
from pathlib import Path
import sys

# 1. Register repository root and backend module paths in sys.path
REPO_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = REPO_ROOT / "backend"

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Add each backend subdirectory (cv, ocr, extraction, rule_engine, evidence) to sys.path
for subdir in BACKEND_DIR.iterdir():
    if subdir.is_dir() and str(subdir) not in sys.path:
        sys.path.insert(0, str(subdir))

try:
    from dotenv import load_dotenv
    if (REPO_ROOT / ".env").exists():
        load_dotenv(REPO_ROOT / ".env")
    if (REPO_ROOT / ".env.local").exists():
        load_dotenv(REPO_ROOT / ".env.local", override=True)
    if (BACKEND_DIR / ".env").exists():
        load_dotenv(BACKEND_DIR / ".env", override=True)
    if (BACKEND_DIR / ".env.local").exists():
        load_dotenv(BACKEND_DIR / ".env.local", override=True)
    load_dotenv()
except Exception:
    pass

# 2. Import FastAPI application from backend/evidence/server.py
from server import app

# 3. Mount Test UI HUD at /test-ui for lightweight diagnostics
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

TEST_UI_DIR = REPO_ROOT / "backend" / "integration" / "test_ui"
if TEST_UI_DIR.is_dir():
    app.mount("/test-ui", StaticFiles(directory=str(TEST_UI_DIR), html=True), name="test_ui")

# 3b. Mount Decoupled Evidence Storage
STORAGE_DIR = REPO_ROOT / "backend" / "storage"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/storage", StaticFiles(directory=str(STORAGE_DIR)), name="storage")

# 4. Mount React 18 Production Build (from frontend/dist)
DIST_DIR = REPO_ROOT / "frontend" / "dist"
if DIST_DIR.is_dir():
    # Mount assets folder with immutable caching (HTTP 304 / 1-year browser cache)
    assets_dir = DIST_DIR / "assets"
    if assets_dir.is_dir():
        class CachedStaticFiles(StaticFiles):
            def file_response(self, *args, **kwargs):
                resp = super().file_response(*args, **kwargs)
                resp.headers["Cache-Control"] = "public, max-age=31536000, immutable"
                return resp

        app.mount("/assets", CachedStaticFiles(directory=str(assets_dir)), name="spa_assets")

    # Catch-all route to serve index.html for client-side routing (SPA)
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Allow API, docs, redoc, openapi.json, and test-ui to pass through to FastAPI handlers
        if full_path.startswith(("api/", "docs", "redoc", "openapi.json", "test-ui")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="API endpoint not found.")

        # Check if requested path is a storage asset
        if full_path.startswith("storage/"):
            rel = full_path.replace("storage/", "", 1)
            storage_file = (STORAGE_DIR / rel).resolve()
            if storage_file.is_file():
                return FileResponse(storage_file)
            # Check public storage directory
            pub_storage = (REPO_ROOT / "frontend" / "public" / full_path).resolve()
            if pub_storage.is_file():
                return FileResponse(pub_storage)
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Storage asset not found.")

        file_path = DIST_DIR / full_path
        if file_path.is_file():
            headers = {}
            if full_path.startswith("assets/"):
                headers["Cache-Control"] = "public, max-age=31536000, immutable"
            return FileResponse(file_path, headers=headers)
        return FileResponse(DIST_DIR / "index.html", headers={"Cache-Control": "no-cache"})

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    workers = int(os.getenv("WORKERS", "1"))
    if workers > 1:
        uvicorn.run("backend.main:app", host=host, port=port, workers=workers, reload=False)
    else:
        uvicorn.run("backend.main:app", host=host, port=port, reload=False)
