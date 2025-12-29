import json
from models.llm_response import LLMResponse
from vertexai.generative_models import GenerationResponse

def get_last_ai_message(res:dict)->str:
        msgs = res['messages']
        for msg in reversed(msgs):
            msg = msg.dict()
            print(msg)
            if msg['type'] == 'ai':
                return msg['content']
        
        return "sorry! ai did not respond."

def get_vertex_ai_message(res:GenerationResponse)->LLMResponse:
        try : 
          resDict = json.loads(res.text)
          llmRes = LLMResponse(**resDict)
          return llmRes
        except Exception as e:
          print("Error parsing LLM response")
          print(res)
          print(e)
          return LLMResponse(type="error", data={"response": "something went wrong"})