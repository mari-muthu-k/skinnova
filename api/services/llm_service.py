import httpx
from llm import skinnovaLLM
from services.datadog_service import llm_metrics
from utils.tracing import traced

async def llm_chat(payload: dict):
        res = skinnovaLLM.vertex_chat(payload)
        return res