from models.hallucination import PrefilterResult
from models.llm_response import LLMResponse
from utils.text_utils import contains_any, is_profile_partial

CLAIMS = {
 "MEDICAL_TERMS" : {
    "terms" : ["diagnose", "diagnosis", "disease", "infection",
    "eczema", "psoriasis", "rosacea", "fungal",
    "bacterial", "prescription", "antibiotic",
    "cure", "heal", "treat"],
    "score" : 0.4,
    "tag" : "medical_claim"
 },

"ABSOLUTE_TERMS" : {
    "terms" : ["always", "guaranteed", "permanent",
    "100%", "instantly", "overnight",
    "in days", "in 7 days", "in a week"],
    "score" : 0.2,
    "tag" : "absolute_claim"
 },

"BRAND_NAMES" : {
    "terms" : ["cerave", "the ordinary", "neutrogena",
    "la roche", "olay", "clinique"],
    "score" : 0.3,
    "tag" : "brand_violation"
 },

"RISKY_INGREDIENTS" : {
    "terms" : ["tretinoin", "isotretinoin",
    "hydroquinone", "high strength retinol"],
    "score" : 0.4,
    "tag" : "unsafe_ingredient"
 }
}


def get_risk_score(text : str,triggers : list)->float:
    risk_score = 0.0
    if text != "":
      for claim in CLAIMS:
        terms  = CLAIMS[claim]["terms"]
        if contains_any(text, terms):
            risk_score += CLAIMS[claim]["score"]
            triggers.append(CLAIMS[claim]["tag"])
    return risk_score

def skinnova_prefilter(
    llm_response : LLMResponse
) -> PrefilterResult:
    
    triggers = []
    risk_score = 0.0

    routine_mode = llm_response.Type == "routine"
    if routine_mode:
        print("Routine mode detected in prefilter.")
        if is_profile_partial(llm_response.Data.Profile):
            triggers.append("premature_routine")
            risk_score += 0.6
        risk_score += get_risk_score(llm_response.Data.UsageInstructions or "")
    else: 
        print("Routine mode not detected in prefilter.")
        risk_score += get_risk_score(llm_response.Data.Response,triggers)      

    risk_score = min(1.0, round(risk_score, 2))

    # Decision threshold (tuned for cost savings)
    should_evaluate = risk_score >= 0.25

    return PrefilterResult(
         should_evaluate=should_evaluate,
         risk_score=risk_score,
         triggers=triggers
    )