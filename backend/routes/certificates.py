from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from models import Certificate, Student
from models import db
from utils.crypto import sign_certificate, verify_certificate as verify_cert_signature
from utils.pdf_generator import generate_certificate_pdf
from utils.qr_generator import generate_qr_code
from datetime import datetime
import os

bp = Blueprint('certificates', __name__, url_prefix='/api/certificates')

# ============================================
# ISSUE CERTIFICATE (PROTECTED)
# ============================================
@bp.route('', methods=['POST', 'OPTIONS'])
@jwt_required()
def issue_certificate():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    
    # Create or get student
    student = Student.query.filter_by(student_id=data['student_id']).first()
    if not student:
        student = Student(
            first_name=data['first_name'],
            last_name=data['last_name'],
            student_id=data['student_id'],
            email=data.get('email')
        )
        db.session.add(student)
        db.session.flush()
    
    # Create certificate
    certificate = Certificate(
        student_id=student.id,
        degree=data['degree'],
        program=data['program'],
        issue_date=datetime.strptime(data['issue_date'], '%Y-%m-%d').date(),
        signature=''  
    )
    db.session.add(certificate)
    db.session.flush()
    
    # Payload for signature
    payload = {
        'uuid': certificate.uuid,
        'student_name': f"{student.first_name} {student.last_name}",
        'student_id': student.student_id,
        'degree': certificate.degree,
        'program': certificate.program,
        'issue_date': certificate.issue_date.isoformat(),
        'issuer': 'Puntland State University'
    }
    
    signature = sign_certificate(payload)
    certificate.signature = signature
    
    # Generate QR
    verification_url = f"https://psu-certificate-verification-live.vercel.app/verify/{certificate.uuid}"
    qr_path = generate_qr_code(verification_url, certificate.uuid)
    
    # Generate PDF
    pdf_path = generate_certificate_pdf(certificate, student, qr_path)
    certificate.pdf_path = pdf_path
    
    db.session.commit()
    
    return jsonify({
        'id': certificate.id,
        'uuid': certificate.uuid,
        'message': 'Certificate issued successfully'
    }), 201

# ============================================
# LIST CERTIFICATES (PROTECTED)
# ============================================
@bp.route('', methods=['GET', 'OPTIONS'])
@jwt_required()
def list_certificates():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        certificates = db.session.query(Certificate, Student).join(Student).all()
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({'error': 'Database error', 'details': str(e)}), 500
    
    result = []
    for cert, student in certificates:
        result.append({
            'id': cert.id,
            'uuid': cert.uuid,
            'student_name': f"{student.first_name} {student.last_name}",
            'student_id': student.student_id,
            'degree': cert.degree,
            'program': cert.program,
            'issue_date': cert.issue_date.isoformat(),
            'revoked': cert.revoked,
            'created_at': cert.created_at.isoformat()
        })
    
    return jsonify(result)

# ============================================
# GET CERTIFICATE DETAILS (PROTECTED)
# ============================================
@bp.route('/<uuid>', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_certificate(uuid):
    if request.method == 'OPTIONS':
        return '', 200

    certificate = Certificate.query.filter_by(uuid=uuid).first()
    if not certificate:
        return jsonify({'error': 'Certificate not found'}), 404
    
    student = Student.query.get(certificate.student_id)
    
    return jsonify({
        'id': certificate.id,
        'uuid': certificate.uuid,
        'student': {
            'name': f"{student.first_name} {student.last_name}",
            'student_id': student.student_id,
            'email': student.email
        },
        'degree': certificate.degree,
        'program': certificate.program,
        'issue_date': certificate.issue_date.isoformat(),
        'revoked': certificate.revoked,
        'revoked_reason': certificate.revoked_reason,
        'created_at': certificate.created_at.isoformat()
    })

# ============================================
# VERIFY CERTIFICATE (PUBLIC)
# ============================================
@bp.route('/<uuid>/verify', methods=['GET'])
def verify_certificate(uuid):
    certificate = Certificate.query.filter_by(uuid=uuid).first()
    
    if not certificate:
        return jsonify({
            'status': 'NOT_FOUND',
            'message': 'Certificate not found'
        }), 404
    
    if certificate.revoked:
        return jsonify({
            'status': 'REVOKED',
            'message': 'Certificate has been revoked',
            'reason': certificate.revoked_reason
        })
    
    student = Student.query.get(certificate.student_id)
    
    payload = {
        'uuid': certificate.uuid,
        'student_name': f"{student.first_name} {student.last_name}",
        'student_id': student.student_id,
        'degree': certificate.degree,
        'program': certificate.program,
        'issue_date': certificate.issue_date.isoformat(),
        'issuer': 'Puntland State University'
    }
    
    is_valid = verify_cert_signature(payload, certificate.signature)
    
    if is_valid:
        return jsonify({
            'status': 'VALID',
            'message': 'Certificate is valid',
            'certificate': {
                'student_name': f"{student.first_name} {student.last_name}",
                'student_id': student.student_id,
                'degree': certificate.degree,
                'program': certificate.program,
                'issue_date': certificate.issue_date.isoformat(),
                'issuer': 'Puntland State University'
            }
        })
    else:
        return jsonify({
            'status': 'INVALID',
            'message': 'Certificate signature is invalid'
        }), 400

# ============================================
# REVOKE CERTIFICATE (PROTECTED)
# ============================================
@bp.route('/<uuid>/revoke', methods=['POST', 'OPTIONS'])
@jwt_required()
def revoke_certificate(uuid):
    if request.method == 'OPTIONS':
        return '', 200
    
    certificate = Certificate.query.filter_by(uuid=uuid).first()
    if not certificate:
        return jsonify({'error': 'Certificate not found'}), 404
    
    data = request.get_json()
    certificate.revoked = True
    certificate.revoked_reason = data.get('reason', 'No reason provided')
    
    db.session.commit()
    
    return jsonify({'message': 'Certificate revoked successfully'})

# ============================================
# DOWNLOAD CERTIFICATE PDF (PUBLIC)
# ============================================
@bp.route('/<uuid>/download', methods=['GET'])
def download_certificate(uuid):
    certificate = Certificate.query.filter_by(uuid=uuid).first()
    if not certificate or not certificate.pdf_path:
        return jsonify({'error': 'Certificate or PDF not found'}), 404
    
    if not os.path.exists(certificate.pdf_path):
        return jsonify({'error': 'PDF file not found'}), 404
    
    return send_file(certificate.pdf_path, as_attachment=True)
