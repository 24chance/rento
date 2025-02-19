# app/schemas.py
from pydantic import BaseModel
from datetime import datetime


# Users 
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


# Houses
class HouseCreate(BaseModel):
    title: str
    description: str
    price: float
    location: str

class HouseUpdate(BaseModel):
    title: str
    description: str
    price: float
    location: str

class HouseOut(BaseModel):
    id: int
    title: str
    description: str
    price: float
    location: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# bookings

class BookingCreate(BaseModel):
    house_id: int
    check_in: datetime
    check_out: datetime
    status: str

    class Config:
        orm_mode = True

class BookingOut(BaseModel):
    id: int
    house_id: int
    user_id: int
    check_in: datetime
    check_out: datetime
    status: str
    created_at: datetime

    class Config:
        orm_mode = True