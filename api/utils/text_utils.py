import json


def contains_any(text: str, terms: set[str]) -> bool:
    text = text.lower()
    return any(term in text for term in terms)


def routine_generated_too_early(answer: str, profile: dict) -> bool:
    required = ["age", "skin_type", "concerns"]
    missing = [k for k in required if not profile.get(k)]
    return bool(missing) and '"morning_routine"' in answer


def extract_ingredients(text: str, ingredients: set[str]) -> list[str]:
    text = text.lower()
    return [i for i in ingredients if i in text]

def extract_profile_in_routine(text: str) -> dict:
    try:
     textRes = json.loads(text)
     if textRes.get("type","") == "routine" and "profile" in textRes:
        return textRes["profile"]

    except Exception as e:
        print(f"Error extracting profile: {e}")
        return {}