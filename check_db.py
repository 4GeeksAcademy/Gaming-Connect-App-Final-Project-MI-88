import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from app import app
from api.models import db, User

with app.app_context():
    users = User.query.all()
    for u in users:
        print(f"User: {u.user_name}, Favorites: {u.favorites}")
