import json
from models.hallucination import PrefilterResult
from utils.text_utils import contains_any, routine_generated_too_early


MEDICAL_TERMS = {
    "diagnose", "diagnosis", "disease", "infection",
    "eczema", "psoriasis", "rosacea", "fungal",
    "bacterial", "prescription", "antibiotic",
    "cure", "heal", "treat"
}

ABSOLUTE_TERMS = {
    "always", "guaranteed", "permanent",
    "100%", "instantly", "overnight",
    "in days", "in 7 days", "in a week"
}

BRAND_NAMES = {
    "cerave", "the ordinary", "neutrogena",
    "la roche", "olay", "clinique"
}

RISKY_INGREDIENTS = {
    "tretinoin", "isotretinoin",
    "hydroquinone", "high strength retinol"
}


def skinnova_prefilter(
    answer: str
) -> PrefilterResult:
    
    ai_res = {}
    triggers = []
    risk_score = 0.0
    text = answer.lower()

    routine_mode = contains_any(text, {"morning_routine", "evening_routine", "night_routine"})
    if routine_mode:
        print("Routine mode detected in prefilter.")
        try:
           ai_res = json.loads(answer)
           if routine_generated_too_early(answer, ai_res.get("profile", {})):
             triggers.append("premature_routine")
             risk_score += 0.6
        except Exception:
            triggers.append("json_format_violation")
            risk_score += 0.6

    # R1: Medical overreach
    if contains_any(text, MEDICAL_TERMS):
        triggers.append("medical_claim")
        risk_score += 0.4

    # R2: Absolute / guaranteed claims
    if contains_any(text, ABSOLUTE_TERMS):
        triggers.append("absolute_claim")
        risk_score += 0.2

    # R3: Brand recommendations
    if contains_any(text, BRAND_NAMES):
        triggers.append("brand_violation")
        risk_score += 0.3

    # R4: Unsafe ingredient usage
    if contains_any(text, RISKY_INGREDIENTS):
        triggers.append("unsafe_ingredient")
        risk_score += 0.4        

    risk_score = min(1.0, round(risk_score, 2))

    # Decision threshold (tuned for cost savings)
    should_evaluate = risk_score >= 0.25

    return PrefilterResult(
         should_evaluate=should_evaluate,
         risk_score=risk_score,
         triggers=triggers
    )