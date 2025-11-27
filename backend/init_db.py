#!/usr/bin/env python3
"""Initialize database with default admin user"""

from app import app, db
from models import Admin, Issuer
import os

def init_database():
    """Initialize database with tables and default data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create default admin user
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(username='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            print("Default admin user created (username: admin, password: admin123)")
        
        # Create issuer record
        issuer = Issuer.query.filter_by(name='Puntland State University').first()
        if not issuer:
            # Read public key
            public_key_path = 'keys/public_key.pem'
            if os.path.exists(public_key_path):
                with open(public_key_path, 'r') as f:
                    public_key_pem = f.read()
                
                issuer = Issuer(
                    name='Puntland State University',
                    public_key_pem=public_key_pem,
                    private_key_reference='keys/private_key.pem'
                )
                db.session.add(issuer)
                print("Issuer record created")
            else:
                print("Warning: Public key not found. Run generate_keys.py first.")
        
        db.session.commit()
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()