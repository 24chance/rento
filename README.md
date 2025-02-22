# R3nt0 - A Rental Booking Platform

R3nt0 is a modern web application designed for both property owners and renters. Owners can list and manage their properties (create, update, and delete houses) while renters can browse available houses and book their perfect stay. The project features a responsive UI with a sleek dashboard, modals for details and bookings, and toast notifications for better user experience.

## Features

- **User Authentication**  
  - Secure login (including Google authentication).
  
- **Owner Dashboard:**  
  - Manage properties with the ability to create, update, and delete houses.
  - View bookings related to the houses they own.
  - Confirm or cancel bookings with real-time UI updates.
  
- **Renter Dashboard:**  
  - Browse available houses and view detailed information.
  - Book a house by selecting check-in and check-out dates via a calendar input.
  
- **Responsive & Modern UI:**  
  - Clean design using Tailwind CSS.
  - Modals for detailed views and booking forms.
  - Toast notifications (using react-toastify) for a non-blocking user experience.
  
- **API Integration:**  
  - Uses Axios to communicate with the backend API.
  - API endpoints for user authentication, property management, and booking management.

## Technologies Used For Frontend

- **React:** For building the user interface.
- **React Router:** For handling client-side routing.
- **React Hook Form:** For managing form state and validation.
- **Axios:** For API calls.
- **Tailwind CSS:** For styling and responsive design.
- **React Toastify:** For toast notifications.
- **Framer Motion:** For smooth animations.
- **React Icons:** For iconography.
- **PNPM:** For package management.

## Installation

### Prerequisites

- **Node.js (v14 or later)** and **npm** (or **pnpm**)

### Steps to Clone and Run Locally

1. **Clone the Repository:**

   ```
   git clone https://github.com/yourusername/rento.git
   cd rento/frontend
   ```
2. **Install dependencies:**
   ```
   pnpm install
   ```
3. **Run development server:**
   ```
   pnpm install
   ```


## Technologies used for Backend

- The backend API is built with FastAPI and provides endpoints for user authentication (manual and Google OAuth), property management, and booking management.

- **FastAPI:** The main web framework.
- **SQLAlchemy (with Async support):** ORM for database interactions.
- **PostgreSQL + asyncpg:** Database and asynchronous PostgreSQL driver.
- **Authlib:** For Google OAuth integration.
- **Python-Jose:** For handling JWT tokens.
- **Passlib:** For password hashing.
- **python-dotenv:** To load environment variables from a .env file.
- **Starlette:** Underlying ASGI framework used by FastAPI.
- **Uvicorn:** ASGI server to run the API.
- **Additional libraries:** httpx, itsdangerous, and optionally Alembic (for migrations)

### Steps to Clone and Run Locally

1. **Clone the Repository:**

   ```
   git clone https://github.com/yourusername/rento.git
   cd rento/backend
   ```
2. **Install dependencies:**

   ```
   pip install -r requirements.txt
   ```
3. **Set up your .env file:**

   ```
    DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
    SECRET_KEY=your_secret_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. **Run the App**

   ```
   uvicorn app.main:app --reload
   ```
   
