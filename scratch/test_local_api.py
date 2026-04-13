import requests

def test_backend_hello():
    try:
        res = requests.get("http://localhost:3001/api/hello")
        print(f"Hello endpoint: {res.status_code}")
        print(f"Response: {res.json()}")
    except Exception as e:
        print(f"Hello endpoint failed: {e}")

def test_backend_games():
    try:
        # Testing the proxy endpoint
        payload = {
            "endpoint": "games",
            "query": 'fields name; search "Zelda"; limit 1;'
        }
        res = requests.post("http://localhost:3001/api/games", json=payload)
        print(f"Games endpoint: {res.status_code}")
        if res.status_code == 200:
            print(f"Response: {res.json()}")
        else:
            print(f"Error: {res.text}")
    except Exception as e:
        print(f"Games endpoint failed: {e}")

if __name__ == "__main__":
    test_backend_hello()
    test_backend_games()
