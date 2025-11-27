# PSU Certificate Verification System - Complete Overview

## System Architecture

### Backend (Flask + PostgreSQL)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT tokens
- **Security**: RSA digital signatures for certificate integrity
- **File Generation**: PDF certificates with QR codes
- **API**: RESTful endpoints for all operations

### Frontend (React + Vite + Tailwind)
- **Framework**: React 18 with Vite build tool
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for SPA navigation
- **State Management**: Context API for authentication
- **HTTP Client**: Axios for API communication

## Key Features Implemented

### 1. Digital Certificate Issuance
- Admin can issue certificates with student details
- Automatic UUID generation for each certificate
- Digital signature using RSA private key
- PDF generation with QR code for verification
- Database storage with complete audit trail

### 2. Certificate Verification
- Public verification page accessible without login
- QR code scanning support (via URL)
- Real-time signature verification
- Status checking (Valid/Revoked/Not Found)
- Complete certificate details display

### 3. Admin Portal
- Secure JWT-based authentication
- Dashboard with statistics and recent certificates
- Certificate management (view, download, revoke)
- Comprehensive certificate listing with filters
- Revocation system with reason tracking

### 4. Security Features
- RSA-2048 digital signatures
- Canonical JSON payload creation
- Public key verification
- JWT token authentication
- CORS protection
- Input validation and sanitization

## Database Schema

### Tables
1. **admins** - Admin user accounts
2. **students** - Student information
3. **certificates** - Certificate records with signatures
4. **issuers** - Public/private key management

### Key Relationships
- Students can have multiple certificates
- Certificates are linked to students
- Issuers manage cryptographic keys

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info

### Certificates
- `POST /api/certificates` - Issue new certificate
- `GET /api/certificates` - List all certificates
- `GET /api/certificates/:uuid` - Get certificate details
- `GET /api/certificates/:uuid/verify` - Verify certificate
- `POST /api/certificates/:uuid/revoke` - Revoke certificate
- `GET /api/certificates/:uuid/download` - Download PDF

## Frontend Routes

### Public Routes
- `/` - Certificate verification page
- `/verify` - Certificate verification form
- `/verify/:uuid` - Direct certificate verification

### Protected Admin Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard
- `/admin/certificates` - Certificate list
- `/admin/certificates/new` - Issue new certificate
- `/admin/certificates/:id` - Certificate details

## File Structure

```
psu-certificate-verification/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   ├── utils/            # Utilities (crypto, PDF, QR)
│   ├── migrations/       # Database migrations
│   ├── certificates/     # Generated PDFs and QR codes
│   ├── keys/            # RSA key pairs
│   └── app.py           # Main Flask application
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   └── utils/       # Frontend utilities
│   └── public/          # Static assets
├── docker-compose.yml   # Docker orchestration
└── setup.sh            # Automated setup script
```

## Security Considerations

### Digital Signatures
- RSA-2048 key pairs for maximum security
- Canonical JSON payload ensures signature integrity
- Public key verification prevents tampering
- Signature stored separately from certificate data

### Authentication
- JWT tokens with configurable expiration
- Secure password hashing with Werkzeug
- Protected admin routes with middleware
- CORS configuration for cross-origin requests

### Data Protection
- Input validation on all forms
- SQL injection prevention with SQLAlchemy ORM
- XSS protection with proper data sanitization
- Secure file handling for PDFs and images

## Deployment Options

### Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Setup
```bash
./setup.sh
```

### Production Considerations
- Use environment variables for secrets
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Use production database credentials
- Configure proper logging and monitoring

## Default Credentials
- **Username**: admin
- **Password**: admin123

## Certificate Verification Process

1. **Certificate Creation**:
   - Generate UUID for certificate
   - Create canonical JSON payload
   - Sign payload with private key
   - Generate QR code with verification URL
   - Create PDF with certificate details
   - Store in database with signature

2. **Verification Process**:
   - Extract certificate UUID from request
   - Fetch certificate from database
   - Reconstruct canonical payload
   - Verify signature with public key
   - Check revocation status
   - Return verification result

## QR Code Integration

- QR codes contain verification URLs
- Format: `https://verify.psu.edu/cert/{uuid}`
- Scannable with any QR code reader
- Direct link to verification page
- Mobile-friendly verification interface

## PDF Certificate Features

- Professional PSU branding
- Student information display
- QR code for verification
- Certificate UUID for tracking
- Issue date and signature
- Tamper-evident design

This system provides a complete, secure, and user-friendly solution for digital certificate management and verification for Puntland State University.