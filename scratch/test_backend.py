import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_igdb():
    client_id = os.getenv('VITE_IGDB_CLIENT_ID')
    client_secret = os.getenv('VITE_IGDB_CLIENT_SECRET')
    
    print(f"Testing IGDB with Client ID: {client_id}")
    
    token_url = "https://id.twitch.tv/oauth2/token"
    token_params = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials"
    }
    
    try:
        res = requests.post(token_url, params=token_params)
        print(f"Token response status: {res.status_code}")
        if res.status_code == 200:
            print("Token fetch successful!")
            token = res.json().get('access_token')
            
            # Try a simple search
            igdb_url = "https://api.igdb.com/v4/games"
            headers = {
                "Client-ID": client_id,
                "Authorization": f"Bearer {token}"
            }
            query = 'fields name; search "Zelda"; limit 1;'
            res = requests.post(igdb_url, headers=headers, data=query)
            print(f"IGDB Search status: {res.status_code}")
            if res.status_code == 200:
                print("IGDB Search successful!")
                print(f"Result: {res.json()}")
            else:
                print(f"Search failed: {res.text}")
        else:
            print(f"Token fetch failed: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_db():
    db_url = os.getenv("DATABASE_URL")
    print(f"Testing DB connection to: {db_url}")
    # We can't easily test without sqlalchemy here, but we can check if it's likely valid
    if not db_url:
        print("DATABASE_URL is not set!")
    elif "postgres" in db_url:
        print("Postgres URL detected. Ensuring backend is configured to use it.")
    else:
        print("Non-postgres URL detected.")

if __name__ == "__main__":
    test_igdb()
    test_db()
