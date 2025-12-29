from models.user import User
from pydantic import BaseModel, Field


class DataModel(BaseModel):
    Profile :  User | None = Field(..., alias="profile")
    Response : str = Field(..., alias="response")
    MorningRoutine : list | None = Field(... , alias="morning_routine")
    EveningRoutine : list | None = Field(... , alias="evening_routine")
    NightRoutine : list | None = Field(... , alias="night_routine")
    UsageInstructions : str | None = Field(... , alias="usage_instructions")

class LLMResponse(BaseModel):
    Type: str = Field(..., alias="type", description="type of response") # values : "chat", "routine" or "error"
    Data : DataModel = Field(..., alias="data")

   