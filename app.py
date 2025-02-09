from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
import numpy as np
import getters


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests
conn = sqlite3.connect("ML_Project_State_Prediction/NBA_db.db")
data = {
    "players": getters.getTeams(conn),
   
    "stats": {"points_per_game": 110.2, "rebounds_per_game": 44.1},
    "data": {"season": "2023-24", "games_played": 82}
}
del data["players"]["2TM"]
del data["players"]["3TM"]
del data["players"]["Team"]
del data["players"][""]
conn.close()

@app.route("/api/<option>", methods=["GET"])
def get_data(option):
    if option in data:
        return jsonify(list(data[option]))
    
         
    return jsonify({"error": "Invalid option"}), 404

@app.route('/api/players/<team>', methods=['GET'])
def get_players(team):
    if team in data["players"]:
        return jsonify(list(data["players"][team]["Player"]))
    return jsonify({"error": "Team not found"}), 404

@app.route('/api/stats/<player>', methods=['GET'])
def get_player_stats(player):
        conn = sqlite3.connect("ML_Project_State_Prediction/NBA_db.db")
        df = getters.getPlayer("Player",player,conn)
        conn.close()
        return jsonify(df.to_dict())

if __name__ == "__main__":
    app.run(debug=True)
