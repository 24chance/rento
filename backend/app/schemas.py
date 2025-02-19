# app/schemas.py
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    username: str
    profile_picture: str
    password: str
    role: str

class UserCreate(UserBase):
    google_id: str

class UserLogin(BaseModel):
    email: str
    password: str