
def get_last_ai_message(res:dict)->str:
        msgs = res['messages']
        for msg in reversed(msgs):
            msg = msg.dict()
            print(msg)
            if msg['type'] == 'ai':
                return msg['content']
        
        return "sorry! ai did not respond."