# PSU Certificate Verification System

A full-stack certificate verification system for Puntland State University.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Flask + SQLAlchemy
- Database: PostgreSQL
- Features: QR codes, PDF generation, Digital signatures

## Quick Start

### Using Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python generate_keys.py  # Generate RSA keys
flask run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb psu_certificates
```

## URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000




## Environment Variables
Create `.env` files in both frontend and backend directories (see `.env.example` files).

## API Endpoints
- POST /api/auth/login - Admin login
- POST /api/certificates - Issue certificate
- GET /api/certificates - List certificates
- GET /api/certificates/:uuid - Get certificate details
- GET /api/certificates/:uuid/verify - Verify certificate
- POST /api/certificates/:uuid/revoke - Revoke certificate
- GET /api/certificates/:uuid/download - Download PDF