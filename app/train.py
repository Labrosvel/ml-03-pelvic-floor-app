"""Generate a synthetic cohort and train the pelvic-floor risk classifier.

The dataset is fully synthetic (no real patient data). Labels are derived from
a clinically-inspired latent risk score plus noise, then a RandomForest learns
to recover the risk category. Running this module writes a model artifact that
the API loads at startup.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

from app.schema import FEATURE_NAMES, RISK_LABELS

DEFAULT_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "model.joblib"


def _latent_risk(rows: np.ndarray) -> np.ndarray:
    """Compute a continuous latent risk score for each synthetic row."""
    age, bmi, pregnancies, deliveries, impact, cough, constipation, symptoms = rows.T
    score = (
        0.028 * (age - 30)
        + 0.06 * (bmi - 24)
        + 0.35 * pregnancies
        + 0.55 * deliveries
        + 0.7 * impact
        + 0.9 * cough
        + 0.8 * constipation
        + 0.45 * symptoms
    )
    return score


def make_dataset(n_samples: int, seed: int) -> tuple[np.ndarray, np.ndarray]:
    """Build a synthetic feature matrix and risk labels (0=low,1=moderate,2=high)."""
    rng = np.random.default_rng(seed)

    age = rng.integers(18, 80, size=n_samples)
    bmi = np.clip(rng.normal(26, 5, size=n_samples), 15, 55)
    pregnancies = rng.poisson(1.2, size=n_samples).clip(0, 10)
    vaginal_deliveries = np.minimum(
        pregnancies, rng.binomial(pregnancies, 0.75)
    )
    high_impact = rng.binomial(1, 0.3, size=n_samples)
    chronic_cough = rng.binomial(1, 0.15, size=n_samples)
    constipation = rng.binomial(1, 0.2, size=n_samples)
    symptom_score = rng.integers(0, 11, size=n_samples)

    features = np.column_stack(
        [
            age,
            bmi,
            pregnancies,
            vaginal_deliveries,
            high_impact,
            chronic_cough,
            constipation,
            symptom_score,
        ]
    ).astype(float)

    score = _latent_risk(features)
    noise = rng.normal(0, 0.6, size=n_samples)
    score = score + noise

    # Bucket the latent score into three risk categories using fixed cut points.
    labels = np.zeros(n_samples, dtype=int)
    labels[score > 2.0] = 1
    labels[score > 4.5] = 2

    return features, labels


def train(
    n_samples: int = 6000,
    seed: int = 42,
    model_path: Path = DEFAULT_MODEL_PATH,
) -> dict:
    """Train the classifier, persist it, and return training metadata."""
    features, labels = make_dataset(n_samples, seed)
    x_train, x_test, y_train, y_test = train_test_split(
        features, labels, test_size=0.2, random_state=seed, stratify=labels
    )

    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        min_samples_leaf=5,
        random_state=seed,
        n_jobs=-1,
    )
    clf.fit(x_train, y_train)

    accuracy = float(accuracy_score(y_test, clf.predict(x_test)))

    artifact = {
        "model": clf,
        "feature_names": FEATURE_NAMES,
        "risk_labels": RISK_LABELS,
        "metrics": {"test_accuracy": accuracy, "n_samples": n_samples},
    }

    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, model_path)

    return {"model_path": str(model_path), "test_accuracy": accuracy}


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the pelvic-floor risk model.")
    parser.add_argument("--samples", type=int, default=6000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--out", type=Path, default=DEFAULT_MODEL_PATH)
    args = parser.parse_args()

    result = train(n_samples=args.samples, seed=args.seed, model_path=args.out)
    print(
        f"Trained model -> {result['model_path']} "
        f"(test accuracy: {result['test_accuracy']:.3f})"
    )


if __name__ == "__main__":
    main()
