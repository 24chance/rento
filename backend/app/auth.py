import os
from fastapi import APIRouter, Depends, HTTPException, status, Body
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.requests import Request
from starlette.responses import RedirectResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from jose import jwt, JWTError
from datetime import datetime
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models import User, House, Booking
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from database import engine
from utils import hash_password, verify_password, create_jwt_token, verify_jwt_token
from schemas import UserBase, UserUpdate, HouseCreate, HouseUpdate, HouseOut, BookingCreate, BookingOut


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
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode

@router.get("/auth")
async def auth(request: Request, db: Session = Depends(get_db)):    
    try:
        token = await oauth.google.authorize_access_token(request)
        if not token:
            raise HTTPException(status_code=400, detail="OAuth token missing or invalid")

        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to fetch user information")
        
        stmt = select(User).filter(User.google_id == user_info["sub"])
        result = await db.execute(stmt)
        db_user = result.scalars().first()

        if not db_user:
            db_user = User(
                email=user_info["email"],
                username=user_info["name"],
                profile_picture=user_info.get("picture"),
                google_id=user_info["sub"]
            )
            db.add(db_user)
            await db.commit()
            await db.refresh(db_user)

        # Generate JWT token
        jwt_token = create_jwt_token({"sub": db_user.email})

        # Redirect user to frontend with token as query params
        frontend_url = "http://localhost:5173/google-auth"  # Change this to your frontend's redirect page
        query_params = urlencode({
            "token": jwt_token,
            "email": db_user.email,
            "username": db_user.username,
            "profile_picture": db_user.profile_picture or "",
            "google_id": db_user.google_id
        })
        return RedirectResponse(url=f"{frontend_url}?{query_params}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
    except OAuthError as e:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"OAuth error: {str(e)}")
    
    except Exception as e:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

@router.get("/auth/logout")
async def logout():
    response = RedirectResponse(url='/')
    response.delete_cookie("access_token")  # Delete the JWT token cookie
    return response


# manual signup here 
@router.post("/signup")
async def signup(user: UserBase, db: AsyncSession = Depends(get_db)):
    # Check if email or username already exists
    stmt = select(User).where((User.email == user.email))
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if existing_user:
        if existing_user.email == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and create user
    new_user = User(
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "User registered successfully"}



# manual login here
@router.post("/login")
async def login(user: UserBase, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    stmt = select(User).where(User.email == user.email)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Generate JWT token
    jwt_token = create_jwt_token({"sub": existing_user.email})

    return {"access_token": jwt_token, "token_type": "bearer"}



from fastapi import UploadFile, File, Form

@router.patch("/users/{user_id}/profile", response_model=UserUpdate)
async def update_user_profile(
    user_id: int,
    file: UploadFile = File(None),  # Make file optional
    username: str = Form(None),  # Optional username
    role: str = Form(None),  # Optional role
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the current user is updating their own profile (or admin)
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    # Fetch the user from the database
    stmt = select(User).filter(User.id == user_id)
    result = await db.execute(stmt)
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Handle profile picture upload if provided
    if file:
        upload_dir = "uploads/profile_pictures"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"user_{user_id}_{int(datetime.utcnow().timestamp())}{file_extension}"
        file_path = os.path.join(upload_dir, new_filename)
        
        with open(file_path, "wb") as f:
            content = await file.read()  # Read file content asynchronously
            f.write(content)
        
        db_user.profile_picture = file_path  # Update profile picture

    # Update username if provided
    if username:
        db_user.username = username

    # Update role if provided
    if role:
        db_user.role = role

    # Commit changes
    await db.commit()
    await db.refresh(db_user)

    return db_user





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

# get a specific house for a logged in user
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
async def update_house(house_id: int, house: HouseUpdate, db: AsyncSession = Depends(get_db)):
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
async def delete_house(house_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(House).filter(House.id == house_id)
    result = await db.execute(stmt)
    house = result.scalars().first()

    if not house:
        raise HTTPException(status_code=404, detail="House not found")

    await db.delete(house)
    await db.commit()

    return house





# --------------------------------------bookings----------------------------------
from sqlalchemy.sql import or_

# create a booking
@router.post("/bookings", response_model=BookingOut)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Check if house exists
    stmt = select(House).filter(House.id == booking.house_id)
    result = await db.execute(stmt)
    house = result.scalars().first()


    if not house:
        raise HTTPException(status_code=404, detail="House not found")
    

    # Check if the dates overlap with existing bookings
    stmt = select(Booking).filter(
        Booking.house_id == booking.house_id,
        Booking.status != booking.status,
        or_(Booking.check_in <= booking.check_out, Booking.check_out >= booking.check_in)
    )
    result = await db.execute(stmt)
    conflicting_booking = result.scalars().first()

    if conflicting_booking:
        raise HTTPException(status_code=400, detail="The property is already booked for these dates")

    # Create new booking
    new_booking = Booking(
        house_id=booking.house_id,
        user_id=current_user.id,
        check_in=booking.check_in,
        check_out=booking.check_out,
    )
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)

    return new_booking


# confirm the booking 
@router.put("/bookings/{booking_id}/confirm")
async def confirm_booking(booking_id: int, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stmt = select(Booking).filter(Booking.id == booking_id)
    result = await db.execute(stmt) 
    booking = result.scalars().first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == 'cancelled':
        raise HTTPException(status_code=400, detail="Canceled bookings cannot be confirmed")

    # Ensure that `house` is loaded first
    stmt = select(House).filter(House.id == booking.house_id)
    result = await db.execute(stmt)
    house = result.scalars().first()

    if not house:
        raise HTTPException(status_code=404, detail="House not found")

    if house.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to confirm this booking")

    booking.status = 'confirmed'
    await db.commit() 
    await db.refresh(booking)

    return booking



# cancel the booking 
@router.put("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: int, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    stmt = select(Booking).filter(Booking.id == booking_id)
    result = await db.execute(stmt) 
    booking = result.scalars().first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == 'cancelled':
        raise HTTPException(status_code=400, detail="Booking is already cancelled")

    # Ensure that `house` is loaded first
    stmt = select(House).filter(House.id == booking.house_id)
    result = await db.execute(stmt)
    house = result.scalars().first()

    if not house:
        raise HTTPException(status_code=404, detail="House not found")

    if house.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    booking.status = 'cancelled'
    await db.commit() 
    await db.refresh(booking)

    return booking

# get bookings to a specific user 
@router.get("/bookings/user", response_model=List[BookingOut])
async def get_user_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    stmt = select(Booking).filter(Booking.user_id == current_user.id)
    result = await db.execute(stmt)
    bookings = result.scalars().all()

    return bookings

# get all bookings
@router.get("/bookings/all", response_model=List[BookingOut])
async def get_all_bookings(
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Booking)
    result = await db.execute(stmt)
    bookings = result.scalars().all()

    return bookings