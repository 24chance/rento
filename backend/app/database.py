from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Use asyncpg with SQLAlchemy
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Async session
SessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

# Dependency to get the DB session
async def get_db():
    async with SessionLocal() as session:
        yield session
