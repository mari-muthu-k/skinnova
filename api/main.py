import os
from fastapi import FastAPI, Request
from routers import health, llm
from utils.exception_handler import ExceptionBase 
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from webhooks import datadog_incident

app = FastAPI(title="SkinNova LLM Backend with Datadog Observability", version="1.0.0",openapi_url="",root_path="/api/v1")

#Todo : add startup and shutdown events for db connections etc

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ALLOW_ORIGINS").split(",")],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type","Content-Length"],
)

app.include_router(llm.router, prefix="/llm")
app.include_router(health.router, prefix="/health")
app.include_router(datadog_incident.router, prefix="/webhooks/datadog")

@app.exception_handler(ExceptionBase)
async def exception_handler(request: Request, exc: ExceptionBase):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message":exc.message},
    )