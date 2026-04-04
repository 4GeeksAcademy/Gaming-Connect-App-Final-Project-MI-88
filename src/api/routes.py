"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import os
import requests

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
    return jsonify({"token": access_token, "user_id": user.id, "email": user.email})


@api.route('/games', methods=['POST'])
def get_games():
    """
    Proxy endpoint to forward requests to IGDB API.
    Expects the frontend to send the query in the request body.
    """
    try:
        # Get IGDB credentials from environment
        client_id = os.getenv('VITE_IGDB_CLIENT_ID')
        client_secret = os.getenv('VITE_IGDB_CLIENT_SECRET')

        if not client_id or not client_secret:
            return jsonify({"error": "IGDB credentials not configured"}), 500

        # Get the authorization token from IGDB
        token_url = "https://id.twitch.tv/oauth2/token"
        token_params = {
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "client_credentials"
        }

        token_response = requests.post(token_url, params=token_params)
        if token_response.status_code != 200:
            return jsonify({"error": "Failed to authenticate with IGDB"}), 401

        token_data = token_response.json()
        access_token = token_data.get('access_token')

        # Get the query/endpoint from request
        data = request.get_json()
        endpoint = data.get('endpoint', 'games')
        query = data.get('query', '')

        # Make request to IGDB API
        igdb_url = f"https://api.igdb.com/v4/{endpoint}"
        headers = {
            "Accept": "application/json",
            "Client-ID": client_id,
            "Authorization": f"Bearer {access_token}"
        }

        igdb_response = requests.post(igdb_url, headers=headers, data=query)

        if igdb_response.status_code != 200:
            return jsonify({"error": "IGDB API request failed"}), igdb_response.status_code

        # Return the IGDB response to the frontend
        return jsonify(igdb_response.json()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
