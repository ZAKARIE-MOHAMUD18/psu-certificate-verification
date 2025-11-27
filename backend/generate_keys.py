#!/usr/bin/env python3
"""Generate RSA key pair for certificate signing"""

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import os

def generate_key_pair():
    """Generate RSA key pair and save to files"""
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    
    # Get public key
    public_key = private_key.public_key()
    
    # Ensure keys directory exists
    os.makedirs('keys', exist_ok=True)
    
    # Serialize private key
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    # Serialize public key
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    # Save keys to files
    with open('keys/private_key.pem', 'wb') as f:
        f.write(private_pem)
    
    with open('keys/public_key.pem', 'wb') as f:
        f.write(public_pem)
    
    print("RSA key pair generated successfully!")
    print("Private key: keys/private_key.pem")
    print("Public key: keys/public_key.pem")

if __name__ == '__main__':
    generate_key_pair()