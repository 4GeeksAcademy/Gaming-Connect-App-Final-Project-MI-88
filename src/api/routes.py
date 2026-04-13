"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, FriendRequest, Availability
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import os
import requests
import json
from datetime import datetime
import json
from datetime import datetime

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
    first_name = (body.get("first_name") or "").strip()
    last_name = (body.get("last_name") or "").strip()

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
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    new_user = User()
    new_user.email = email
    new_user.password = password
    new_user.user_name = user_name
    new_user.date_of_birth = date_of_birth
    new_user.first_name = first_name
    new_user.last_name = last_name
    new_user.is_active = True
    db.session.add(new_user)
    db.session.commit()
    print(new_user.id)
    for day in days: 
        new_day = Availability()
        new_day.day = day
        new_day.start_time = None
        new_day.end_time = None
        new_day.user_id = new_user.id
        db.session.add(new_day)
    db.session.commit()

    # Auto-login after signup
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({
        "msg": "User successfully created",
        "token": access_token,
        "user_id": new_user.id,
        "email": new_user.email,
        "user_name": new_user.user_name
    }), 201


@api.route('/login', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id, "email": user.email, "user_name": user.user_name})


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
        if "availability" in data:
            for day_data in data["availability"]:
                day_name = day_data.get("day", "").lower()
                available_row = next((a for a in user.availability if a.day == day_name), None)
                if available_row:
                    available_row.start_time = day_data.get("start")
                    available_row.end_time = day_data.get("end")
        if "bio" in data:
            user.bio = data["bio"]
        if "preferred_genre" in data:
            user.preferred_genre = data["preferred_genre"]
        if "playstyle" in data:
            user.playstyle = data["playstyle"]
        if "favorite_game" in data:
            user.favorite_game = data["favorite_game"]
        
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


@api.route('/profile/favorites/<int:game_id>/review', methods=['PATCH'])
@jwt_required()
def update_favorite_review(game_id):
    """Update the personal rating and review for a favorite game."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        personal_rating = data.get("personal_rating")
        review = data.get("review")

        user.update_favorite_review(game_id, personal_rating, review)
        db.session.commit()

        return jsonify({"msg": "Review updated", "favorites": user.serialize()["favorites"]}), 200
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
        friends = User.query.filter(User.id.in_(
            friends_ids)).all() if friends_ids else []

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
        friends = User.query.filter(User.id.in_(
            friends_ids)).all() if friends_ids else []

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
        friends = User.query.filter(User.id.in_(
            friends_ids)).all() if friends_ids else []

        return jsonify({"msg": "Friend removed", "friends": [{"id": f.id, "user_name": f.user_name} for f in friends]}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    """Get a public profile for any user by ID."""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = user.serialize()
        # Omit private fields from public view
        data.pop("email", None)
        data.pop("friends", None)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/search-users', methods=['GET'])
@jwt_required()
def search_users():
    """Search for users based on filters."""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user:
            return jsonify({"error": "User not found"}), 404

        # Get query parameters
        username = request.args.get('username', '').strip()
        game = request.args.get('game', '').strip()
        skill_min = request.args.get('skill_min')
        skill_max = request.args.get('skill_max')
        age_min = request.args.get('age_min')
        age_max = request.args.get('age_max')

        # Start with all users except current user
        query = User.query.filter(User.id != user_id)

        # Filter by username (case insensitive)
        if username:
            query = query.filter(User.user_name.ilike(f'%{username}%'))

        # Get all users first, then filter in Python for complex conditions
        users = query.all()
        filtered_users = []

        for user in users:
            include = True

            # Filter by game
            if game:
                favorites = json.loads(
                    user.favorites) if user.favorites else []
                game_names = [fav.get('name', '').lower() for fav in favorites]
                if game.lower() not in game_names:
                    include = False

            # Filter by skill level
            if skill_min or skill_max:
                favorites = json.loads(
                    user.favorites) if user.favorites else []
                skills = [fav.get('skill_level', 1)
                          for fav in favorites if fav.get('skill_level')]
                if not skills:
                    include = False
                else:
                    min_skill = min(skills)
                    max_skill = max(skills)
                    if skill_min and max_skill < int(skill_min):
                        include = False
                    if skill_max and min_skill > int(skill_max):
                        include = False

            # Filter by age
            if age_min or age_max:
                if not user.date_of_birth:
                    include = False
                else:
                    try:
                        birth_date = datetime.strptime(
                            user.date_of_birth, '%Y-%m-%d')
                        today = datetime.today()
                        age = today.year - birth_date.year - \
                            ((today.month, today.day) <
                             (birth_date.month, birth_date.day))
                        if age_min and age < int(age_min):
                            include = False
                        if age_max and age > int(age_max):
                            include = False
                    except ValueError:
                        include = False

            if include:
                filtered_users.append(user)

        # Return serialized users
        return jsonify([user.serialize() for user in filtered_users]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get recommended users based on current user's profile."""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user:
            return jsonify({"error": "User not found"}), 404

        # Get parameters
        skill_range = int(request.args.get('skill_range', 3))
        age_range = int(request.args.get('age_range', 5))
        specific_game = request.args.get('specific_game', '').strip()

        # Calculate current user's age
        if not current_user.date_of_birth:
            return jsonify({"error": "User date of birth not set"}), 400

        try:
            birth_date = datetime.strptime(
                current_user.date_of_birth, '%Y-%m-%d')
            today = datetime.today()
            user_age = today.year - birth_date.year - \
                ((today.month, today.day) < (birth_date.month, birth_date.day))
        except ValueError:
            return jsonify({"error": "Invalid date of birth format"}), 400

        # Get current user's favorites
        user_favorites = json.loads(
            current_user.favorites) if current_user.favorites else []
        if not user_favorites:
            return jsonify([]), 200  # No favorites, no recommendations

        # Get all other users
        other_users = User.query.filter(User.id != user_id).all()
        recommendations = []

        for user in other_users:
            if not user.date_of_birth:
                continue

            try:
                user_birth = datetime.strptime(user.date_of_birth, '%Y-%m-%d')
                other_age = today.year - user_birth.year - \
                    ((today.month, today.day) < (user_birth.month, user_birth.day))
            except ValueError:
                continue

            # Check age range (skip if -1, meaning any age)
            if age_range != -1 and abs(user_age - other_age) > age_range:
                continue

            # Get other user's favorites
            other_favorites = json.loads(
                user.favorites) if user.favorites else []
            if not other_favorites:
                continue

            # Find matching games
            matching_games = []
            for user_game in user_favorites:
                user_game_name = user_game.get('name', '').lower()
                user_skill = user_game.get('skill_level', 1)

                for other_game in other_favorites:
                    other_game_name = other_game.get('name', '').lower()
                    other_skill = other_game.get('skill_level', 1)

                    # Check game match
                    if specific_game:
                        # Focus on specific game
                        if user_game_name == specific_game.lower() and other_game_name == specific_game.lower():
                            if skill_range == -1 or abs(user_skill - other_skill) <= skill_range:
                                matching_games.append({
                                    'game': user_game['name'],
                                    'user_skill': user_skill,
                                    'other_skill': other_skill
                                })
                    else:
                        # Any matching game
                        if user_game_name == other_game_name:
                            if skill_range == -1 or abs(user_skill - other_skill) <= skill_range:
                                matching_games.append({
                                    'game': user_game['name'],
                                    'user_skill': user_skill,
                                    'other_skill': other_skill
                                })

            if matching_games:
                recommendations.append({
                    'id': user.id,
                    'user_name': user.user_name,
                    'email': user.email,
                    'favorites': other_favorites,
                    'matching_games': matching_games,
                    'age': other_age
                })

        # Sort by number of matching games (most matches first)
        recommendations.sort(key=lambda x: len(
            x['matching_games']), reverse=True)

        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/friend-requests', methods=['POST'])
@jwt_required()
def send_friend_request():
    """Send a friend request to another user."""
    try:
        sender_id = int(get_jwt_identity())
        data = request.json
        receiver_id = data.get("receiver_id")

        if not receiver_id:
            return jsonify({"error": "receiver_id is required"}), 400

        if sender_id == receiver_id:
            return jsonify({"error": "Cannot send a request to yourself"}), 400

        receiver = User.query.get(receiver_id)
        if not receiver:
            return jsonify({"error": "User not found"}), 404

        # Check if already friends
        sender = User.query.get(sender_id)
        import json as _json
        friends = _json.loads(sender.friends) if sender.friends else []
        if receiver_id in friends:
            return jsonify({"error": "Already friends"}), 400

        # Check if a pending request already exists in either direction
        existing = FriendRequest.query.filter(
            FriendRequest.status == 'pending',
            db.or_(
                db.and_(FriendRequest.sender_id == sender_id, FriendRequest.receiver_id == receiver_id),
                db.and_(FriendRequest.sender_id == receiver_id, FriendRequest.receiver_id == sender_id)
            )
        ).first()
        if existing:
            return jsonify({"error": "A pending request already exists"}), 400

        req = FriendRequest(sender_id=sender_id, receiver_id=receiver_id, status='pending')
        db.session.add(req)
        db.session.commit()

        return jsonify(req.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/friend-requests', methods=['GET'])
@jwt_required()
def get_friend_requests():
    """Get all pending incoming friend requests for the current user."""
    try:
        user_id = int(get_jwt_identity())
        pending = FriendRequest.query.filter_by(receiver_id=user_id, status='pending').all()

        result = []
        for req in pending:
            sender = User.query.get(req.sender_id)
            result.append({
                "id": req.id,
                "sender_id": req.sender_id,
                "sender_username": sender.user_name if sender else "Unknown",
                "sender_picture": sender.profile_picture_url if sender else None,
                "status": req.status
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/friend-requests/<int:request_id>', methods=['PATCH'])
@jwt_required()
def respond_to_friend_request(request_id):
    """Accept or decline a friend request. Only the receiver can respond."""
    try:
        user_id = int(get_jwt_identity())
        req = FriendRequest.query.get(request_id)

        if not req:
            return jsonify({"error": "Friend request not found"}), 404
        if req.receiver_id != user_id:
            return jsonify({"error": "Not authorized"}), 403
        if req.status != 'pending':
            return jsonify({"error": "Request already responded to"}), 400

        action = request.json.get("status")
        if action not in ("accepted", "declined"):
            return jsonify({"error": "status must be 'accepted' or 'declined'"}), 400

        req.status = action

        if action == "accepted":
            sender = User.query.get(req.sender_id)
            receiver = User.query.get(req.receiver_id)
            if sender and receiver:
                sender.add_friend(receiver.id)
                receiver.add_friend(sender.id)

        db.session.commit()
        return jsonify({"msg": f"Friend request {action}", "status": action}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/friend-requests/status/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_request_status(other_user_id):
    """Check the friend request status between the current user and another user."""
    try:
        user_id = int(get_jwt_identity())

        # Check if already friends
        current_user = User.query.get(user_id)
        import json as _json
        friends = _json.loads(current_user.friends) if current_user.friends else []
        if other_user_id in friends:
            return jsonify({"status": "friends"}), 200

        # Check for any request in either direction
        req = FriendRequest.query.filter(
            db.or_(
                db.and_(FriendRequest.sender_id == user_id, FriendRequest.receiver_id == other_user_id),
                db.and_(FriendRequest.sender_id == other_user_id, FriendRequest.receiver_id == user_id)
            )
        ).order_by(FriendRequest.id.desc()).first()

        if not req:
            return jsonify({"status": "none"}), 200

        if req.status == 'pending':
            if req.sender_id == user_id:
                return jsonify({"status": "request_sent"}), 200
            else:
                return jsonify({"status": "request_received", "request_id": req.id}), 200

        return jsonify({"status": req.status}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
