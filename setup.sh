#!/bin/bash

echo "Setting up PSU Certificate Verification System..."

# Create environment files
echo "Creating environment files..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Backend setup
echo "Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate RSA keys
echo "Generating RSA key pair..."
python generate_keys.py

# Initialize database
echo "Initializing database..."
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Create default admin user
echo "Creating default admin user..."
python init_db.py

cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend

# Install dependencies
npm install

cd ..

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd backend && source venv/bin/activate && flask run"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Or use Docker: docker-compose up --build"
echo ""
echo "Default admin credentials:"
echo "Username: admin"
echo "Password: admin123"