"""End-to-end tests for the pelvic-floor risk API and model."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app import model as model_module
from app.main import app
from app.schema import Assessment
from app.train import train


@pytest.fixture(scope="session", autouse=True)
def trained_model(tmp_path_factory) -> Path:
    """Train a small model once and point the app at it for the test session."""
    model_path = tmp_path_factory.mktemp("models") / "model.joblib"
    train(n_samples=2000, seed=7, model_path=model_path)
    model_module._cached_model = model_module.RiskModel.load(model_path)
    yield model_path
    model_module._cached_model = None


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


def test_health_reports_model_loaded(client: TestClient) -> None:
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["model_loaded"] is True
    assert body["metrics"]["test_accuracy"] > 0.7


def test_predict_low_risk_profile(client: TestClient) -> None:
    payload = {
        "age": 25,
        "bmi": 22.0,
        "num_pregnancies": 0,
        "vaginal_deliveries": 0,
        "high_impact_activity": False,
        "chronic_cough": False,
        "constipation": False,
        "symptom_score": 0,
    }
    res = client.post("/api/predict", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["risk"] == "low"
    assert body["plan"]["level"] == "low"
    assert pytest.approx(sum(body["probabilities"].values()), abs=1e-3) == 1.0


def test_predict_high_risk_profile(client: TestClient) -> None:
    payload = {
        "age": 68,
        "bmi": 34.0,
        "num_pregnancies": 5,
        "vaginal_deliveries": 5,
        "high_impact_activity": True,
        "chronic_cough": True,
        "constipation": True,
        "symptom_score": 9,
    }
    res = client.post("/api/predict", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["risk"] == "high"
    assert body["plan"]["level"] == "high"


def test_predict_validation_error(client: TestClient) -> None:
    res = client.post("/api/predict", json={"age": 5, "bmi": 22.0})
    assert res.status_code == 422


def test_model_predict_returns_full_payload() -> None:
    assessment = Assessment(age=40, bmi=28.0, num_pregnancies=2, vaginal_deliveries=2)
    prediction = model_module.get_model().predict(assessment)
    assert prediction.risk in {"low", "moderate", "high"}
    assert 0.0 <= prediction.confidence <= 1.0
    assert prediction.plan.sets_per_day > 0
