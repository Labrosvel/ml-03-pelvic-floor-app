"""FastAPI application: serves the API and the single-page frontend."""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import __version__
from app.model import get_model
from app.schema import Assessment, PredictionResponse

STATIC_DIR = Path(__file__).resolve().parent / "static"

app = FastAPI(
    title="Pelvic Floor Health App",
    version=__version__,
    description="Estimate pelvic-floor dysfunction risk and get a tailored plan.",
)


@app.get("/health")
def health() -> dict:
    """Liveness/readiness probe reporting whether the model is loaded."""
    try:
        model = get_model()
        return {
            "status": "ok",
            "model_loaded": True,
            "metrics": model.metrics,
            "version": __version__,
        }
    except FileNotFoundError:
        return {"status": "degraded", "model_loaded": False, "version": __version__}


@app.post("/api/predict", response_model=PredictionResponse)
def predict(assessment: Assessment) -> PredictionResponse:
    """Return a pelvic-floor risk estimate and recommended exercise plan."""
    try:
        model = get_model()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return model.predict(assessment)


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
