# app/schemas.py
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    username: str
    profile_picture: str

class UserCreate(UserBase):
    google_id: str
