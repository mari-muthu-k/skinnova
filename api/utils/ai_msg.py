from vertexai.generative_models import GenerationResponse

def get_last_ai_message(res:dict)->str:
        msgs = res['messages']
        for msg in reversed(msgs):
            msg = msg.dict()
            print(msg)
            if msg['type'] == 'ai':
                return msg['content']
        
        return "sorry! ai did not respond."

def get_vertex_ai_message(res:GenerationResponse)->str:
        return res.text