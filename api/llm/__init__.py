import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent

class LLM:
    agent = None
    def __init__(self, model_name: str):
        self.chat_model = ChatGoogleGenerativeAI(
            model=model_name,
            max_retries=3,
        )

        self.agent = create_agent(model=self.chat_model,system_prompt="You're a helpful skin care assistant.") # placeholder prompt

    def chat(self, payload: dict) -> dict:
        response = self.agent.invoke(payload)
        return response

if os.getenv("LLM_MODEL") and os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    skinnovaLLM = LLM(model_name=os.getenv("LLM_MODEL"),token=os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
else:
    raise EnvironmentError("LLM_MODEL and GOOGLE_APPLICATION_CREDENTIALS must be set in environment variables.")