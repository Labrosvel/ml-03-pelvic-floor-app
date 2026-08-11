const form = document.getElementById("assessment-form");
const submitBtn = document.getElementById("submit-btn");
const resultEmpty = document.getElementById("result-empty");
const resultContent = document.getElementById("result-content");
const riskPill = document.getElementById("risk-pill");
const riskLabel = document.getElementById("risk-label");
const riskConf = document.getElementById("risk-conf");
const probBars = document.getElementById("prob-bars");
const planSummary = document.getElementById("plan-summary");
const planStats = document.getElementById("plan-stats");
const planNotes = document.getElementById("plan-notes");
const modelStatus = document.getElementById("model-status");

const symptom = document.getElementById("symptom_score");
const symptomOut = document.getElementById("symptom_score_out");
symptom.addEventListener("input", () => (symptomOut.value = symptom.value));

async function refreshStatus() {
  try {
    const res = await fetch("/health");
    const data = await res.json();
    if (data.model_loaded) {
      const acc = data.metrics?.test_accuracy;
      modelStatus.textContent = acc
        ? `Model loaded · validation accuracy ${(acc * 100).toFixed(1)}%`
        : "Model loaded";
    } else {
      modelStatus.textContent = "Model not trained yet — run `python -m app.train`.";
    }
  } catch (err) {
    modelStatus.textContent = "Unable to reach the API.";
  }
}

function readForm() {
  return {
    age: Number(form.age.value),
    bmi: Number(form.bmi.value),
    num_pregnancies: Number(form.num_pregnancies.value),
    vaginal_deliveries: Number(form.vaginal_deliveries.value),
    high_impact_activity: form.high_impact_activity.checked,
    chronic_cough: form.chronic_cough.checked,
    constipation: form.constipation.checked,
    symptom_score: Number(form.symptom_score.value),
  };
}

function renderResult(data) {
  riskLabel.textContent = data.risk;
  riskConf.textContent = `${(data.confidence * 100).toFixed(0)}% confidence`;
  riskPill.className = `risk risk--${data.risk}`;

  probBars.innerHTML = "";
  ["low", "moderate", "high"].forEach((level) => {
    const pct = ((data.probabilities[level] ?? 0) * 100).toFixed(0);
    const row = document.createElement("div");
    row.className = "bar";
    row.innerHTML = `
      <span>${level}</span>
      <span class="bar__track"><span class="bar__fill bar__fill--${level}" style="width:${pct}%"></span></span>
      <span>${pct}%</span>`;
    probBars.appendChild(row);
  });

  planSummary.textContent = data.plan.summary;
  planStats.innerHTML = `
    <div class="stat"><div class="stat__value">${data.plan.sets_per_day}</div><div class="stat__label">sets / day</div></div>
    <div class="stat"><div class="stat__value">${data.plan.reps_per_set}</div><div class="stat__label">reps / set</div></div>
    <div class="stat"><div class="stat__value">${data.plan.hold_seconds}s</div><div class="stat__label">hold</div></div>
    <div class="stat"><div class="stat__value">${data.plan.rest_seconds}s</div><div class="stat__label">rest</div></div>`;

  planNotes.innerHTML = "";
  data.plan.notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    planNotes.appendChild(li);
  });

  resultEmpty.classList.add("hidden");
  resultContent.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Estimating…";
  try {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readForm()),
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    renderResult(await res.json());
  } catch (err) {
    resultEmpty.classList.remove("hidden");
    resultContent.classList.add("hidden");
    resultEmpty.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Estimate my risk";
  }
});

refreshStatus();
