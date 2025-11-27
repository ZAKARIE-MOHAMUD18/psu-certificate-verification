from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Admin, db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and admin.check_password(password):
        access_token = create_access_token(identity=admin.id)
        return jsonify({
            'access_token': access_token,
            'admin': {
                'id': admin.id,
                'username': admin.username
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_admin():
    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)
    
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    
    return jsonify({
        'id': admin.id,
        'username': admin.username
    })