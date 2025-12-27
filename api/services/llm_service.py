from llm import skinnovaLLM
from llm.hallucination import hallucination_detector
from llm.prefilter import skinnova_prefilter
from services.llm_datadog_metrics import llm_metrics
from services.api_datadog_metrics import api_metrics
from utils.user_msg import get_recent_user_message

async def llm_chat(payload: dict):
        # Call the Skinnova LLM chat model
        res = skinnovaLLM.vertex_chat(payload)
        recent_user_msgs = get_recent_user_message(payload)

        api_metrics.send_metric("user_messages", 1)
        llm_metrics.logging_event("llm_chat_called")
        try: 
                # Check if hallucination detection is required
                prefilter_result = skinnova_prefilter(res.text)
                print(f"Prefilter result: Risk Score={prefilter_result.risk_score}, Triggers={prefilter_result.triggers}, Should Evaluate={prefilter_result.should_evaluate}")
                if prefilter_result.should_evaluate:
                   print("Prefilter triggered hallucination detection.")
                   llm_metrics.log_prefilter(prefilter_result.risk_score, prefilter_result.triggers)
                   hallucination = hallucination_detector.detect_hallucination(recent_user_msgs, res.text) 
                   llm_metrics.log_hallucination(hallucination)

        except Exception as e:
                llm_metrics.log_error("hallucination_detection_failure")
                print(f"Error logging hallucination metrics: {e}")
        return res