import os
from fastapi import APIRouter, Depends, HTTPException
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.requests import Request
from starlette.responses import RedirectResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models import User, Post
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from database import engine



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# Create an AsyncSession instead of a regular session
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

def create_jwt_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_jwt_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
@router.get("/protected")
async def protected_endpoint(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "You are authenticated", "user_info": payload}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.get("/auth/google/login")
async def login_via_google(request: Request):
    url = request.url_for("auth")
    return await oauth.google.authorize_redirect(request, url)

import logging

# Setup basic logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.get("/auth")
async def auth(request: Request, db: Session = Depends(get_db)):
    try:
        # Try to get the token from Google's OAuth flow
        logger.debug("Starting OAuth flow...")
        token = await oauth.google.authorize_access_token(request)
        if not token:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="OAuth token missing or invalid")

        # Extract user info
        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Failed to fetch user information")
        
        logger.debug(f"User info: {user_info}")


        # Check if user already exists in the database
        stmt = select(User).filter(User.google_id == user_info["sub"])
        result = await db.execute(stmt)
        db_user = result.scalars().first()  # Get the first result, if any

            
        if not db_user:
            # If user doesn't exist, create a new user
            new_user = User(
                email=user_info["email"],
                username=user_info["name"],
                profile_picture=user_info.get("picture"),
                google_id=user_info["sub"]
            )
            db.add(new_user)
            # Debug: Check if the new user is added to the session
            logger.debug(f"Adding new user to the session: {new_user}")
            await db.commit()
            await db.refresh(new_user)

             # Debug: Log after commit and refresh
            logger.debug(f"New user added to DB with ID: {new_user.id}")

        # Generate JWT token
        jwt_token = create_jwt_token({"sub": user_info["email"]})

        # Create response object with redirection
        response = RedirectResponse(url='/')  # Change this URL if needed
        response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True,  # Prevent JavaScript from accessing it (helps against XSS)
            samesite="Lax"  # Prevents CSRF (can be changed based on needs)
        )

        return response
    
    except OAuthError as e:
        logger.error(f"OAuthError: {str(e)}")
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"OAuth error: {str(e)}")
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

@router.get("/auth/logout")
async def logout(request: Request):
    response = RedirectResponse(url='/')
    response.delete_cookie("access_token")  # Delete the JWT token cookie
    return response