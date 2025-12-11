import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from utils.file import return_file_contents

class LLM:
    agent = None
    def __init__(self, model_name: str,prompt_path: str = "prompts_v1/skinnova.prompt"):
        self.chat_model = ChatGoogleGenerativeAI(
            model=model_name,
            max_retries=3,
        )

        print("Loading system prompt for skin care assistant...")
        system_prompt = return_file_contents(prompt_path)
        print("System prompt loaded.")

        self.agent = create_agent(model=self.chat_model,system_prompt=system_prompt) # placeholder prompt

    def chat(self, payload: dict) -> dict:
        response = self.agent.invoke(payload)
        return response

if os.getenv("LLM_MODEL") and os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and os.getenv("SYSTEM_PROMPT_PATH"):
    skinnovaLLM = LLM(model_name=os.getenv("LLM_MODEL"),prompt_path=os.getenv("SYSTEM_PROMPT_PATH"))
else:
    raise EnvironmentError("LLM_MODEL and GOOGLE_APPLICATION_CREDENTIALS must be set in environment variables.")