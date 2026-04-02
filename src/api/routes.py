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
    body = request.json
    potential_user = db.session.execute(
        select(User).where(User.email == body["email"])
    ).scalar_one_or_none()
    if potential_user is not None:
        return jsonify({"msg": "User with that email already exists"})
    
    # Creating a new user object
    new_user = User()
    new_user.email = body["email"]

    # Underscores needed for body quotations?

    new_user.first_name = body["first_name"]
    new_user.last_name = body["last_name"]
    new_user.date_of_birth = body["date_of_birth"]
    new_user.user_name = body["user_name"]
    new_user.password = body["password"]
    new_user.is_active = True

    # Adding the user to the database while also saving the database

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User successfully created"}), 201

@api.route('/login', methods=['POST'])
def create_token(): 
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    if User is None:
        return jsonify({"msg": "Bad email or password"}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({ "token": access_token, "user_id": user.id, "email": user.email })
