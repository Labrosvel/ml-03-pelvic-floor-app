"""Rule-based Kegel training plans keyed on predicted risk level."""

from __future__ import annotations

from app.schema import ExercisePlan

_PLANS: dict[str, ExercisePlan] = {
    "low": ExercisePlan(
        level="low",
        summary="Maintenance program to preserve pelvic-floor strength.",
        sets_per_day=2,
        reps_per_set=10,
        hold_seconds=5,
        rest_seconds=5,
        notes=[
            "Keep breathing normally during each hold.",
            "Add a few quick 'flick' contractions after each set.",
            "Reassess in 12 weeks.",
        ],
    ),
    "moderate": ExercisePlan(
        level="moderate",
        summary="Progressive strengthening program with daily practice.",
        sets_per_day=3,
        reps_per_set=10,
        hold_seconds=6,
        rest_seconds=6,
        notes=[
            "Fully relax between contractions to avoid fatigue.",
            "Avoid holding your breath or bearing down.",
            "Consider a check-in with a pelvic-floor physiotherapist.",
        ],
    ),
    "high": ExercisePlan(
        level="high",
        summary="Supervised, gradual program — seek professional guidance.",
        sets_per_day=3,
        reps_per_set=8,
        hold_seconds=3,
        rest_seconds=9,
        notes=[
            "Start with short holds and long rests to build endurance safely.",
            "Book an assessment with a pelvic-floor physiotherapist.",
            "Stop and seek advice if you notice pain or worsening symptoms.",
        ],
    ),
}


def plan_for(risk: str) -> ExercisePlan:
    """Return the recommended exercise plan for the given risk level."""
    try:
        return _PLANS[risk]
    except KeyError as exc:  # pragma: no cover - guarded by RISK_LABELS upstream
        raise ValueError(f"Unknown risk level: {risk!r}") from exc
