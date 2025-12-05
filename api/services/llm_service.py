import os
import httpx
from services.datadog_service import llm_metrics
from utils.tracing import traced

LLM_URL = os.getenv("VERTEX_AI_URL")

@traced("llm.call")
async def call_llm(payload: dict):
    with llm_metrics.track_request():
        async with httpx.AsyncClient() as client:
            res = await client.post(LLM_URL, json=payload)
            res.raise_for_status()
            data = res.json()
            llm_metrics.update_tokens(data)
            return data
