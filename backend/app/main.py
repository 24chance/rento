from fastapi import FastAPI
from auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Ensure all tables are created based on your models
async def create_tables():
    async with engine.begin() as conn:  # Start a new connection
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI()

# Mounting static files (Modify path if needed)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

load_dotenv()

# Allow requests from specific origins (frontend URLs)
origins = [
    "http://localhost",          # Localhost frontend
    "http://localhost:3000",     # If using a React or Next.js app on port 3000
    "https://your-frontend-url.com",  # Replace with your production frontend URL if deployed
]

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # This allows all origins to make requests
    allow_credentials=True,       # Allows cookies and credentials in requests
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],          # Allow all headers
)

# Add the session middleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

@app.on_event("startup")
async def startup():
    await create_tables()  # Create tables when the app starts

app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Endpoint to serve profile pictures directly
@app.get("/uploads/profile_pictures/{filename}")
async def get_profile_picture(filename: str):
    file_path = f"app/uploads/profile_pictures/{filename}"
    if os.path.exists(file_path):
        print(file_path)
        return FileResponse(file_path)
    return {"error": "File not found"}
