from fastapi import APIRouter
from models.llm_response import LLMResponse
from services.llm_service import llm_chat

router = APIRouter()

@router.post("/chat")
async def chat_llm(input: dict):
    llm_chat_res : LLMResponse = await llm_chat(input)
    return {"result": llm_chat_res.Data.Response}