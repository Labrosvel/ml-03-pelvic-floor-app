"""Shared request/response schemas and the clinical feature definition.

The feature list here is the single source of truth used by the training
script, the model wrapper and the API layer so they can never drift apart.
"""

from __future__ import annotations

from pydantic import BaseModel, Field

# Ordered feature names. The trained model expects inputs in exactly this order.
FEATURE_NAMES: list[str] = [
    "age",
    "bmi",
    "num_pregnancies",
    "vaginal_deliveries",
    "high_impact_activity",
    "chronic_cough",
    "constipation",
    "symptom_score",
]

RISK_LABELS: list[str] = ["low", "moderate", "high"]


class Assessment(BaseModel):
    """Self-reported inputs used to estimate pelvic-floor dysfunction risk."""

    age: int = Field(..., ge=18, le=90, description="Age in years.")
    bmi: float = Field(..., ge=12, le=60, description="Body mass index.")
    num_pregnancies: int = Field(
        0, ge=0, le=15, description="Total number of pregnancies."
    )
    vaginal_deliveries: int = Field(
        0, ge=0, le=15, description="Number of vaginal deliveries."
    )
    high_impact_activity: bool = Field(
        False, description="Regular high-impact activity (running, jumping, CrossFit)."
    )
    chronic_cough: bool = Field(
        False, description="Persistent cough or respiratory condition."
    )
    constipation: bool = Field(
        False, description="Frequent straining / constipation."
    )
    symptom_score: int = Field(
        0,
        ge=0,
        le=10,
        description="Self-reported symptom severity (0 = none, 10 = severe).",
    )

    def to_features(self) -> list[float]:
        """Return the feature vector in FEATURE_NAMES order."""
        return [
            float(self.age),
            float(self.bmi),
            float(self.num_pregnancies),
            float(self.vaginal_deliveries),
            float(self.high_impact_activity),
            float(self.chronic_cough),
            float(self.constipation),
            float(self.symptom_score),
        ]


class ExercisePlan(BaseModel):
    """A recommended Kegel training plan tailored to a risk level."""

    level: str
    summary: str
    sets_per_day: int
    reps_per_set: int
    hold_seconds: int
    rest_seconds: int
    notes: list[str]


class PredictionResponse(BaseModel):
    """Model output returned to the client."""

    risk: str
    risk_index: int
    probabilities: dict[str, float]
    confidence: float
    plan: ExercisePlan
