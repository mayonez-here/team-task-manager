from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
import bcrypt
from flask_jwt_extended import create_access_token

auth_routes = Blueprint('auth', __name__)

# ------------------------
# SIGNUP
# ------------------------
@auth_routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # ✅ validation
    if not data or not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "All fields are required"}), 400

    # check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"msg": "Email already exists"}), 400

    # hash password
    hashed_password = bcrypt.hashpw(
        data['password'].encode('utf-8'),
        bcrypt.gensalt()
    )

    # create user (default role = member)
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password.decode('utf-8'),
        role="member"
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


# ------------------------
# LOGIN
# ------------------------
@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # ✅ validation
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Email and password required"}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # check password
    if not bcrypt.checkpw(
        data['password'].encode('utf-8'),
        user.password.encode('utf-8')
    ):
        return jsonify({"msg": "Invalid password"}), 400

    # create JWT token
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role
        }
    })