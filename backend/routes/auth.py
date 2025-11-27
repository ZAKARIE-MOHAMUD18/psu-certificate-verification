from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Admin
from models import db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        username = data.get('username')
        password = data.get('password')
        
        print(f"Login attempt - Username: {username}, Password provided: {bool(password)}")
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        admin = Admin.query.filter_by(username=username).first()
        print(f"Admin found: {bool(admin)}")
        
        if admin and admin.check_password(password):
            access_token = create_access_token(identity=admin.id)
            print(f"Login successful for: {username}")
            return jsonify({
                'access_token': access_token,
                'admin': {
                    'id': admin.id,
                    'username': admin.username
                }
            })
        
        print(f"Login failed for: {username}")
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Server error during login'}), 500

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

@bp.route('/init', methods=['POST'])
def init_admin():
    """Create default admin if none exists"""
    try:
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(username='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            return jsonify({'message': 'Admin created successfully'})
        else:
            return jsonify({'message': 'Admin already exists'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500