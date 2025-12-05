import httpx
from llm import skinnovaLLM
from services.datadog_service import llm_metrics
from utils.tracing import traced

@traced("llm.chat")
async def llm_chat(payload: dict):
    with llm_metrics.track_request():
        async with httpx.AsyncClient() as client:
          res = skinnovaLLM.chat(payload)
          llm_metrics.update_tokens(res)
          return res