from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base 
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from enum import Enum

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    profile_picture = Column(String)
    google_id = Column(String, unique=True)
    password = Column(String)
    role = Column(String)

    houses = relationship("House", back_populates="user")
    bookings = relationship("Booking", back_populates="user")



class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    location = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="houses")
    bookings = relationship("Booking", back_populates="house")




class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    house_id = Column(Integer, ForeignKey("houses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(DateTime(timezone=True))
    check_out = Column(DateTime(timezone=True))
    status = Column(String, default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)

    house = relationship("House", back_populates="bookings")
    user = relationship("User", back_populates="bookings")