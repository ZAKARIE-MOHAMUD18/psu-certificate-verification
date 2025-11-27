from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///psu_certificates.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')

# Initialize db from models
from models import db
db.init_app(app)

migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app, 
     origins=['https://psu-certificate-verification-live.vercel.app', 'http://localhost:5173'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)

from routes import auth, certificates

app.register_blueprint(auth.bp)
app.register_blueprint(certificates.bp)

@app.route('/')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'PSU Certificate Verification API',
        'version': '1.0.0'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/test-login', methods=['POST', 'OPTIONS'])
def test_login():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'status': 'success',
        'message': 'Login endpoint is working',
        'data': request.get_json() if request.get_json() else 'No data received'
    })

@app.route('/init-db')
def init_database():
    """Initialize database and create admin user"""
    try:
        with app.app_context():
            # Create tables
            db.create_all()
            
            # Import here to avoid circular import
            from models import Admin
            admin = Admin.query.filter_by(username='admin').first()
            if not admin:
                admin = Admin(username='admin')
                admin.set_password('admin123')
                db.session.add(admin)
                db.session.commit()
                return jsonify({
                    'status': 'success',
                    'message': 'Database initialized and admin user created',
                    'admin': {'username': 'admin', 'password': 'admin123'}
                })
            else:
                return jsonify({
                    'status': 'success',
                    'message': 'Database already initialized',
                    'admin': {'username': 'admin', 'password': 'admin123'}
                })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)