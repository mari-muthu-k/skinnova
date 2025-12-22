import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from utils.file import return_file_contents
import vertexai 
from vertexai.generative_models import GenerativeModel, GenerationResponse

class LLM:
    agent = None
    def __init__(self, model_name: str,prompt_path: str = "prompts_v1/skinnova.prompt"):
        vertexai.init(
          project=os.getenv("LLM_PROJECT_NAME"),
          location=os.getenv("LLM_REGION")
       )

        print("Loading system prompt for skin care assistant...")
        system_prompt = return_file_contents(prompt_path)
        print("System prompt loaded.")

        self.chat_model = GenerativeModel(model_name=model_name,system_instruction=system_prompt)

    def chat(self, payload: dict) -> dict:
        response = self.chat_model.generate_content(str(payload))
        return response
    
    def vertex_chat(self, payload: dict) -> GenerationResponse:
        response = self.chat_model.generate_content(str(payload))
        return response

if os.getenv("LLM_PROJECT_NAME") and  os.getenv("LLM_REGION") and os.getenv("LLM_MODEL") and os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and os.getenv("SYSTEM_PROMPT_PATH"):
    skinnovaLLM = LLM(model_name=os.getenv("LLM_MODEL"),prompt_path=os.getenv("SYSTEM_PROMPT_PATH"))
else:
    raise EnvironmentError("All LLM environment variables must be set.")