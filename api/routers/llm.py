from fastapi import APIRouter
from services.llm_service import llm_chat
from utils.ai_msg import get_vertex_ai_message

router = APIRouter()

@router.post("/chat")
async def chat_llm(payload: dict):
    response = await llm_chat(payload)
    ai_message = get_vertex_ai_message(response)
    return {"result": ai_message}