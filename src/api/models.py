from typing import Optional, List

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import json

db = SQLAlchemy()


class FriendRequest(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)
    receiver_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='pending')
    # status values: 'pending', 'accepted', 'declined'

    def serialize(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "status": self.status
        }

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=True)
    last_name: Mapped[str] = mapped_column(String(120), nullable=True)
    user_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=True)
    date_of_birth: Mapped[str] = mapped_column(String(120), nullable=True)
    profile_picture_url: Mapped[str] = mapped_column(String(255), nullable=True)
    favorites: Mapped[str] = mapped_column(Text, nullable=True, default='[]')
    friends: Mapped[str] = mapped_column(Text, nullable=True, default='[]')
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    preferred_genre: Mapped[str] = mapped_column(String(120), nullable=True)
    playstyle: Mapped[str] = mapped_column(String(50), nullable=True)
    favorite_game: Mapped[str] = mapped_column(String(120), nullable=True)
    availability: Mapped[List["Availability"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "user_name": self.user_name,
            "date_of_birth": self.date_of_birth,
            "profile_picture_url": self.profile_picture_url,
            "availability": [day.serialize() for day in self.availability],
            "favorites": json.loads(self.favorites) if self.favorites else [],
            "friends": json.loads(self.friends) if self.friends else [],
            "bio": self.bio,
            "preferred_genre": self.preferred_genre,
            "playstyle": self.playstyle,
            "favorite_game": self.favorite_game,
            # do not serialize the password, its a security breach
        }
    
    def add_favorite(self, game_data):
        """Add a game to user's favorites with skill level."""
        try:
            favorites = json.loads(self.favorites) if self.favorites else []
            game_entry = {
                "id": game_data.get("id"),
                "name": game_data.get("name"),
                "cover": game_data.get("cover"),
                "first_release_date": game_data.get("first_release_date"),
                "total_rating": game_data.get("total_rating"),
                "skill_level": game_data.get("skill_level", 1)
            }
            favorites.append(game_entry)
            self.favorites = json.dumps(favorites)
        except Exception as e:
            print(f"Error adding favorite: {e}")
    
    def remove_favorite(self, game_id):
        """Remove a game from user's favorites."""
        try:
            favorites = json.loads(self.favorites) if self.favorites else []
            self.favorites = json.dumps([g for g in favorites if g.get("id") != game_id])
        except Exception as e:
            print(f"Error removing favorite: {e}")
    
    def update_favorite_skill_level(self, game_id, skill_level):
        """Update skill level for a favorite game."""
        try:
            favorites = json.loads(self.favorites) if self.favorites else []
            for game in favorites:
                if game.get("id") == game_id:
                    game["skill_level"] = skill_level
                    break
            self.favorites = json.dumps(favorites)
        except Exception as e:
            print(f"Error updating skill level: {e}")
    
    def update_favorite_review(self, game_id, personal_rating, review):
        """Update personal rating and review for a favorite game."""
        try:
            favorites = json.loads(self.favorites) if self.favorites else []
            for game in favorites:
                if game.get("id") == game_id:
                    game["personal_rating"] = personal_rating
                    game["review"] = review
                    break
            self.favorites = json.dumps(favorites)
        except Exception as e:
            print(f"Error updating review: {e}")
    
    def add_friend(self, friend_id):
        """Add a friend."""
        try:
            friends = json.loads(self.friends) if self.friends else []
            if friend_id not in friends:
                friends.append(friend_id)
                self.friends = json.dumps(friends)
        except Exception as e:
            print(f"Error adding friend: {e}")
    
    def remove_friend(self, friend_id):
        """Remove a friend."""
        try:
            friends = json.loads(self.friends) if self.friends else []
            self.friends = json.dumps([f for f in friends if f != friend_id])
        except Exception as e:
            print(f"Error removing friend: {e}")

class Availability(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    day: Mapped[str] = mapped_column(String(10))
    start_time: Mapped[str] = mapped_column(String(10),nullable=True)
    end_time: Mapped[str] = mapped_column(String(10),nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="availability")

    def serialize(self):
        return {
            "id": self.id,
            "day": self.day,
            "start_time": self.start_time,
            "end_time": self.end_time,
        }