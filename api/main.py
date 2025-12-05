from fastapi import FastAPI
from routers import llm, health
from webhooks import datadog_incident


app = FastAPI(title="LLM Backend with Datadog Observability")

app.include_router(llm.router, prefix="/v1/llm")
app.include_router(health.router, prefix="/health")
app.include_router(datadog_incident.router, prefix="/webhooks/datadog")

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/send-test-metric")
def send_test_metric():
    from services.datadog_service import send_metric
    send_metric("llm_backend.test.metric", 1)
    return {"status": "metric sent"}
