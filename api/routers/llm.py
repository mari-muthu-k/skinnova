from fastapi import APIRouter
from services.llm_service import call_llm

router = APIRouter()

@router.post("/predict")
async def predict(payload: dict):
    response = await call_llm(payload)
    return {"result": response}
