from fastapi import FastAPI
from auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

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

app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}