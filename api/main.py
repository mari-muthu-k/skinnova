from fastapi import FastAPI
from routers import llm, health
from webhooks import datadog_incident
from instrumentation.datadog_tracing import setup_tracing
from instrumentation.datadog_logging import setup_logging

app = FastAPI(title="LLM Backend with Datadog Observability")

setup_tracing()
setup_logging()

app.include_router(llm.router, prefix="/v1/llm")
app.include_router(health.router, prefix="/health")
app.include_router(datadog_incident.router, prefix="/webhooks/datadog")

@app.get("/")
def root():
    return {"status": "running"}
