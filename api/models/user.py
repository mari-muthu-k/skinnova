from pydantic import BaseModel, Field
class User(BaseModel):
    Age : int = Field(..., alias="age")
    SkinType : str = Field(..., alias="skin_type")
    Concerns : str = Field(..., alias="skin_concern")