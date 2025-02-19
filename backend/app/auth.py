import os
from fastapi import APIRouter, Depends, HTTPException, status, Body
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.requests import Request
from starlette.responses import RedirectResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models import User, House
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from database import engine
from utils import hash_password, verify_password, create_jwt_token, verify_jwt_token
from schemas import UserCreate, UserLogin, HouseCreate, HouseUpdate, HouseOut


router = APIRouter()


load_dotenv()

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Update the get_current_user function to properly extract user data
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    # Verify the JWT token
    payload = verify_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Get user email from the token payload (sub claim in the JWT)
    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    # Retrieve the user from the database using the email
    stmt = select(User).filter(User.email == user_email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # Return the user (with all necessary attributes like id, role, etc.)
    return user


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


# Google OAuth, login/signup
@router.get("/auth/google/login")
async def login_via_google(request: Request):
    url = request.url_for("auth")
    return await oauth.google.authorize_redirect(request, url)

# Google OAuth callback
@router.get("/auth")
async def auth(request: Request, db: Session = Depends(get_db)):    
    try:
        # Try to get the token from Google's OAuth flow
        token = await oauth.google.authorize_access_token(request)
        if not token:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="OAuth token missing or invalid")

        # Extract user info
        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Failed to fetch user information")
        


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
            await db.commit()
            await db.refresh(new_user)

             # Debug: Log after commit and refresh

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
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"OAuth error: {str(e)}")
    
    except Exception as e:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

@router.get("/auth/logout")
async def logout(request: Request):
    response = RedirectResponse(url='/')
    response.delete_cookie("access_token")  # Delete the JWT token cookie
    return response


# manual signup here 
@router.post("/signup")
async def signup(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email or username already exists
    stmt = select(User).where((User.email == user.email) | (User.username == user.username))
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if existing_user:
        if existing_user.email == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        if existing_user.username == user.username:
            raise HTTPException(status_code=400, detail="Username already taken")

    # Hash password and create user
    new_user = User(
        email=user.email,
        username=user.username,
        password=hash_password(user.password),
        role=user.role,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "User registered successfully"}



# manual login here
@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    stmt = select(User).where(User.email == user.email)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Generate JWT token
    jwt_token = create_jwt_token({"sub": existing_user.email})

    return {"access_token": jwt_token, "token_type": "bearer"}







# --------------------------------houses------------------------------

# create house
@router.post("/houses", response_model=HouseOut)
async def create_house(house: HouseCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    print(current_user)
    new_house = House(
        title=house.title,
        description=house.description,
        price=house.price,
        location=house.location,
        user_id=current_user.id,
    )

    db.add(new_house)
    await db.commit()
    await db.refresh(new_house)

    return new_house


# get all houses
from typing import List
@router.get("/houses", response_model=List[HouseOut])
async def get_houses(db: AsyncSession = Depends(get_db)):
    stmt = select(House)
    
    result = await db.execute(stmt)
    houses = result.scalars().all()

    return houses


# get houses of a logged in user 
@router.get("/houses/user", response_model=List[HouseOut])
async def get_houses_of_user(db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Filter houses by the current user's ID
    stmt = select(House).filter(House.user_id == current_user.id)
    
    result = await db.execute(stmt)
    houses = result.scalars().all()

    return houses

# get a specific houser for a logged in user
@router.get("/houses/user/{house_id}", response_model=HouseOut)
async def get_house_of_user_by_id(house_id: int, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Get the specific house by ID and filter by the current user's ID 
    stmt = select(House).filter(House.id == house_id, House.user_id == current_user.id)

    result = await db.execute(stmt)
    house = result.scalars().first()

    if not house:
        raise HTTPException(status_code=404, detail="House not found or not authorized to view this house")

    return house

# get a specific house 
@router.get("/houses/{house_id}", response_model=HouseOut)
async def get_house_by_id(house_id: int, db: AsyncSession = Depends(get_db)):
    # Get the specific house by ID and filter by the current user's ID 
    stmt = select(House).filter(House.id == house_id)

    result = await db.execute(stmt)
    house = result.scalars().first()

    if not house:
        raise HTTPException(status_code=404, detail="House not found or not authorized to view this house")

    return house

# update house 
@router.patch("/houses/{house_id}", response_model=HouseOut)
async def update_house(house_id: int, house: HouseUpdate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stmt = select(House).filter(House.id == house_id)
    result = await db.execute(stmt)
    existing_house = result.scalars().first()

    if not existing_house:
        raise HTTPException(status_code=404, detail="House not found")

    existing_house.title = house.title
    existing_house.description = house.description
    existing_house.price = house.price
    existing_house.location = house.location
    existing_house.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(existing_house)

    return existing_house


# delete a house 
@router.delete("/houses/{house_id}", response_model=HouseOut)
async def delete_house(house_id: int, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stmt = select(House).filter(House.id == house_id)
    result = await db.execute(stmt)
    house = result.scalars().first()

    if not house:
        raise HTTPException(status_code=404, detail="House not found")

    await db.delete(house)
    await db.commit()

    return house