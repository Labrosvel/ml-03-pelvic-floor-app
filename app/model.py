"""Load the trained artifact and expose a small prediction helper."""

from __future__ import annotations

import threading
from pathlib import Path

import joblib
import numpy as np

from app.recommend import plan_for
from app.schema import Assessment, PredictionResponse
from app.train import DEFAULT_MODEL_PATH


class RiskModel:
    """Thin wrapper around the persisted scikit-learn classifier."""

    def __init__(self, artifact: dict) -> None:
        self._model = artifact["model"]
        self._feature_names = artifact["feature_names"]
        self._risk_labels = artifact["risk_labels"]
        self._metrics = artifact.get("metrics", {})

    @classmethod
    def load(cls, model_path: Path = DEFAULT_MODEL_PATH) -> "RiskModel":
        if not Path(model_path).exists():
            raise FileNotFoundError(
                f"Model artifact not found at {model_path}. "
                "Run `python -m app.train` to create it."
            )
        return cls(joblib.load(model_path))

    @property
    def metrics(self) -> dict:
        return self._metrics

    def predict(self, assessment: Assessment) -> PredictionResponse:
        features = np.array([assessment.to_features()], dtype=float)
        probabilities = self._model.predict_proba(features)[0]
        risk_index = int(np.argmax(probabilities))
        risk = self._risk_labels[risk_index]

        prob_map = {
            label: round(float(prob), 4)
            for label, prob in zip(self._risk_labels, probabilities)
        }

        return PredictionResponse(
            risk=risk,
            risk_index=risk_index,
            probabilities=prob_map,
            confidence=round(float(probabilities[risk_index]), 4),
            plan=plan_for(risk),
        )


_lock = threading.Lock()
_cached_model: RiskModel | None = None


def get_model(model_path: Path = DEFAULT_MODEL_PATH) -> RiskModel:
    """Return a process-wide cached model instance, loading it on first use."""
    global _cached_model
    if _cached_model is None:
        with _lock:
            if _cached_model is None:
                _cached_model = RiskModel.load(model_path)
    return _cached_model
