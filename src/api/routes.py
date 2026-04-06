"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def handle_sign_up():
    body = request.json or {}
    email = (body.get("email") or "").strip()
    password = body.get("password")
    user_name = (body.get("user_name") or "").strip()
    date_of_birth = (body.get("date_of_birth") or "").strip()

    if not all([email, password, user_name, date_of_birth]):
        return jsonify({"msg": "all fields required"}), 400

    potential_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()
    if potential_user is not None:
        return jsonify({"msg": "User with that email already exists"}), 400

    taken = db.session.execute(
        select(User).where(User.user_name == user_name)
    ).scalar_one_or_none()
    if taken is not None:
        return jsonify({"msg": "That username is taken"}), 400

    new_user = User()
    new_user.email = email
    new_user.password = password
    new_user.user_name = user_name
    new_user.date_of_birth = date_of_birth
    new_user.is_active = True
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User successfully created"}), 201

@api.route('/login', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": access_token,
        "user_id": user.id,
        "user_name": user.user_name,
    })


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200
