# app/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional



# Users 
class UserBase(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    email: Optional[str]
    username: Optional[str]
    role: Optional[str] 
    profile_picture: Optional[str]


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