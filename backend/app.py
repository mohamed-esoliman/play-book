from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
from dotenv import load_dotenv
import time

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

access_token = None
api_client = None


def get_access_token():
    global access_token
    if not access_token:
        try:
            response = requests.post(
                f"https://id.twitch.tv/oauth2/token",
                params={
                    "client_id": os.getenv("IGDB_ID"),
                    "client_secret": os.getenv("IGDB_SECRET"),
                    "grant_type": "client_credentials",
                },
            )
            response.raise_for_status()
            access_token = response.json().get("access_token")
        except requests.exceptions.RequestException as err:
            print(f"Error: {err}")
    return access_token


def get_api_client():
    global api_client, access_token
    if not api_client:
        access_token = get_access_token()
        api_client = {
            "base_url": "https://api.igdb.com/v4",
            "headers": {
                "Client-ID": os.getenv("IGDB_ID"),
                "Authorization": f"Bearer {access_token}",
            },
        }
    return api_client


def refresh_access_token():
    global api_client, access_token
    access_token = None
    api_client = None
    return get_api_client()


@app.route("/games", methods=["POST"])
def get_games():
    try:
        api_client = get_api_client()

        limit_per_page = request.json.get("limit_per_page", 20)
        offset = (request.json.get("page_number", 1) - 1) * limit_per_page

        popularity_response = requests.post(
            f"{api_client['base_url']}/popularity_primitives",
            data=f"fields game_id, value; sort value desc; limit {limit_per_page}; offset {offset};",
            headers=api_client["headers"],
        )
        popularity_response.raise_for_status()
        popular_games_data = popularity_response.json()

        game_ids_str = ','.join([str(game['game_id']) for game in popular_games_data])

        query = f"fields {request.json.get('fields', '*')}; where id = ({game_ids_str});"

        response = requests.post(
            f"{api_client['base_url']}/games",
            data=query,
            headers=api_client["headers"],
        )

        response.raise_for_status()
        games = response.json()

        return jsonify(games)

    except requests.exceptions.RequestException as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500


@app.route("/specificGame", methods=["POST"])
def get_specific_game():
    try:
        api_client = get_api_client()
        query = f"fields *; where id = {request.json.get('gameId')};"
        response = requests.post(
            f"{api_client['base_url']}/games", data=query, headers=api_client["headers"]
        )
        if response.status_code == 401:
            api_client = refresh_access_token()
            response = requests.post(
                f"{api_client['base_url']}/games",
                data=query,
                headers=api_client["headers"],
            )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as err:
        print(f"Error: {err}")
        return jsonify({"error": str(err)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
