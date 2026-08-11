# ml-03-pelvic-floor-app

A small full-stack machine-learning app that estimates **pelvic-floor
dysfunction risk** from a short self-assessment and returns a tailored Kegel
training plan. It pairs a scikit-learn classifier with a FastAPI backend and a
lightweight single-page frontend.

> Educational demo only — the model is trained on **synthetic** data and is not
> a medical device or a substitute for professional advice.

## Stack

- **Backend:** FastAPI + Uvicorn
- **Model:** scikit-learn `RandomForestClassifier` (3-class risk)
- **Frontend:** static HTML/CSS/JS served by FastAPI
- **Tests:** pytest via FastAPI `TestClient`

## Project layout

```
app/
  main.py        # FastAPI app + routes, serves the SPA
  model.py       # loads the trained artifact, prediction helper
  train.py       # synthetic data generation + model training
  recommend.py   # rule-based exercise plans per risk level
  schema.py      # pydantic schemas + canonical feature list
  static/        # index.html, styles.css, app.js
tests/           # end-to-end API/model tests
scripts/
  setup.sh       # idempotent install + train
  run.sh         # start the dev server
```

## Quickstart

```bash
# Install deps + train the model (creates .venv and models/model.joblib)
bash scripts/setup.sh

# Run the app on http://localhost:8000
bash scripts/run.sh
```

Then open http://localhost:8000, fill in the assessment, and click
**Estimate my risk**.

## API

- `GET /health` — liveness probe + model metrics.
- `POST /api/predict` — body is an assessment; returns risk, class
  probabilities, and a recommended exercise plan.

```bash
curl -s localhost:8000/api/predict \
  -H 'content-type: application/json' \
  -d '{"age":68,"bmi":34,"num_pregnancies":5,"vaginal_deliveries":5,
       "high_impact_activity":true,"chronic_cough":true,
       "constipation":true,"symptom_score":9}'
```

## Development

```bash
source .venv/bin/activate

python -m app.train        # retrain the model
pytest -q                  # run the test suite
```

## Cloud Agent environment

`.cursor/environment.json` runs `scripts/setup.sh` as the install step and
starts the server in the `web` terminal on port `8000`.
