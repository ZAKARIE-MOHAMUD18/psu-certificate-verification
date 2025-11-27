from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import json
import base64
import os

def load_private_key():
    """Load private key from file"""
    key_path = os.path.join('keys', 'private_key.pem')
    if not os.path.exists(key_path):
        raise FileNotFoundError("Private key not found. Run generate_keys.py first.")
    
    with open(key_path, 'rb') as f:
        private_key = serialization.load_pem_private_key(
            f.read(),
            password=None
        )
    return private_key

def load_public_key():
    """Load public key from file"""
    key_path = os.path.join('keys', 'public_key.pem')
    if not os.path.exists(key_path):
        raise FileNotFoundError("Public key not found. Run generate_keys.py first.")
    
    with open(key_path, 'rb') as f:
        public_key = serialization.load_pem_public_key(f.read())
    return public_key

def create_canonical_payload(payload):
    """Create canonical JSON representation"""
    return json.dumps(payload, sort_keys=True, separators=(',', ':')).encode('utf-8')

def sign_certificate(payload):
    """Sign certificate payload with private key"""
    private_key = load_private_key()
    canonical_payload = create_canonical_payload(payload)
    
    signature = private_key.sign(
        canonical_payload,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    return base64.b64encode(signature).decode('utf-8')

def verify_certificate(payload, signature_b64):
    """Verify certificate signature with public key"""
    try:
        public_key = load_public_key()
        canonical_payload = create_canonical_payload(payload)
        signature = base64.b64decode(signature_b64)
        
        public_key.verify(
            signature,
            canonical_payload,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except Exception:
        return False