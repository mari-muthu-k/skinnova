from fastapi import APIRouter
from services.llm_service import call_llm

router = APIRouter()

@router.post("/chat")
async def chat(payload: dict):
    response = await call_llm(payload)
    return {"result": response}
