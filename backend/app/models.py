from sqlalchemy import Column, Integer, String
from database import Base 
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    profile_picture = Column(String)
    google_id = Column(String, unique=True)

    posts = relationship("Post", back_populates="owner") 


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    owner_id = Column(Integer, ForeignKey('users.id'))  # This is the foreign key to User table

    owner = relationship("User", back_populates="posts") 
