from datadog_agent import datadog_agent
from models.user import User

class UserPersonaMetrics:
    PERSONA_RISK_WEIGHTS = {
    "acne": 1.5,
    "sensitive": 2.0,
    "teen": 2.0,
    "normal": 1.0
    }

    def __init__(self):
        self.datadog_statsd = datadog_agent
    
    def get_age_bucket(age:int)->str:
        if age <= 12:
            return "0-12"
        elif age <= 18:
            return "13-18"
        elif age <= 25:
            return "19-25"
        elif age <= 35:
            return "26-35"
        elif age <= 50:
            return "36-50"
        else:
            return "50+"
        

    def emit_persona_risk(self, user : User):
     risk_weight = self.PERSONA_RISK_WEIGHTS.get(
         user.skin_concern, 1.0
     )

     self.datadog_statsd.gauge(
        "llm.hallucination.persona_risk_weight",
        risk_weight,
        tags=[
            f"user.age_bucket:{self.get_age_bucket(user.age)}",
            f"user.skin_type:{user.skin_type}",
            f"user.skin_concern:{user.skin_concern}",
        ]
      )