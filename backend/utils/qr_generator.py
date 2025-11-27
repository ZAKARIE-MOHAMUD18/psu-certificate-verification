import qrcode
from PIL import Image
import os

def generate_qr_code(url, certificate_uuid):
    """Generate QR code for certificate verification URL"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Ensure certificates directory exists
    os.makedirs('certificates', exist_ok=True)
    
    qr_path = os.path.join('certificates', f'qr_{certificate_uuid}.png')
    img.save(qr_path)
    
    return qr_path