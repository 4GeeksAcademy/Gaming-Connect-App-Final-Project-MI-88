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
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
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


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's profile information."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile information."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.json
        
        # Update fields if provided
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "profile_picture_url" in data:
            user.profile_picture_url = data["profile_picture_url"]
        
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/profile/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    """Add a game to user's favorites."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        game_data = request.json
        user.add_favorite(game_data)
        db.session.commit()
        
        return jsonify({"msg": "Game added to favorites", "favorites": user.serialize()["favorites"]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/profile/favorites/<int:game_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(game_id):
    """Remove a game from user's favorites."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user.remove_favorite(game_id)
        db.session.commit()
        
        return jsonify({"msg": "Game removed from favorites", "favorites": user.serialize()["favorites"]}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/profile/favorites/<int:game_id>/skill', methods=['PATCH'])
@jwt_required()
def update_favorite_skill(game_id):
    """Update the skill level for a favorite game."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.json
        skill_level = data.get("skill_level", 1)
        
        user.update_favorite_skill_level(game_id, skill_level)
        db.session.commit()
        
        return jsonify({"msg": "Skill level updated", "favorites": user.serialize()["favorites"]}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/profile/friends', methods=['GET'])
@jwt_required()
def get_friends():
    """Get user's friends list."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        import json
        friends_ids = json.loads(user.friends) if user.friends else []
        friends = User.query.filter(User.id.in_(friends_ids)).all() if friends_ids else []
        
        return jsonify([{"id": f.id, "user_name": f.user_name, "email": f.email} for f in friends]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/profile/friends', methods=['POST'])
@jwt_required()
def add_friend():
    """Add a friend to user's friends list."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.json
        friend_id = data.get("friend_id")
        
        # Check if friend exists
        friend = User.query.get(friend_id)
        if not friend:
            return jsonify({"error": "Friend not found"}), 404
        
        user.add_friend(friend_id)
        db.session.commit()
        
        import json
        friends_ids = json.loads(user.friends) if user.friends else []
        friends = User.query.filter(User.id.in_(friends_ids)).all() if friends_ids else []
        
        return jsonify({"msg": "Friend added", "friends": [{"id": f.id, "user_name": f.user_name} for f in friends]}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/profile/friends/<int:friend_id>', methods=['DELETE'])
@jwt_required()
def remove_friend(friend_id):
    """Remove a friend from user's friends list."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user.remove_friend(friend_id)
        db.session.commit()
        
        import json
        friends_ids = json.loads(user.friends) if user.friends else []
        friends = User.query.filter(User.id.in_(friends_ids)).all() if friends_ids else []
        
        return jsonify({"msg": "Friend removed", "friends": [{"id": f.id, "user_name": f.user_name} for f in friends]}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
