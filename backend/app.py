from flask import Flask, jsonify, request
from flask_cors import CORS
from ai_helper import get_ai_word, get_ai_hint

app = Flask(__name__)
CORS(app)

# Global game state (for demo purposes)
game_state = {
    "word": "",
    "guessed_letters": [],
    "attempts_left": 6,
    "status": "ongoing",
    "hint": ""
}

def get_masked_word():
    return "".join(c if c in game_state["guessed_letters"] else "_" for c in game_state["word"])

def check_status():
    masked = get_masked_word()
    if "_" not in masked:
        return "won"
    if game_state["attempts_left"] <= 0:
        return "lost"
    return "ongoing"

@app.route("/new-game", methods=["GET"])
def new_game():
    word = get_ai_word()
    game_state["word"] = word
    game_state["guessed_letters"] = []
    game_state["attempts_left"] = 6
    game_state["status"] = "ongoing"
    game_state["hint"] = ""
    
    return jsonify({
        "masked_word": get_masked_word(),
        "attempts_left": game_state["attempts_left"],
        "status": game_state["status"],
        "guessed_letters": game_state["guessed_letters"]
    })

@app.route("/guess", methods=["POST"])
def guess():
    data = request.json
    if not data or "letter" not in data:
        return jsonify({"error": "No letter provided"}), 400
        
    letter = str(data["letter"]).upper()
    
    if len(letter) != 1 or not letter.isalpha():
        return jsonify({"error": "Invalid letter"}), 400
        
    if game_state["status"] != "ongoing":
        return jsonify({"message": "Game over", "status": game_state["status"]}), 400
        
    if letter in game_state["guessed_letters"]:
        return jsonify({
            "message": "Already guessed",
            "masked_word": get_masked_word(),
            "attempts_left": game_state["attempts_left"],
            "status": game_state["status"],
            "guessed_letters": game_state["guessed_letters"]
        })
        
    game_state["guessed_letters"].append(letter)
    
    if letter not in game_state["word"]:
        game_state["attempts_left"] -= 1
        
    game_state["status"] = check_status()
    
    # Return the actual word only if the game is lost
    response_data = {
        "masked_word": get_masked_word(),
        "attempts_left": game_state["attempts_left"],
        "status": game_state["status"],
        "guessed_letters": game_state["guessed_letters"]
    }
    if game_state["status"] == "lost" or game_state["status"] == "won":
        response_data["word"] = game_state["word"] # provide word at the end
        
    return jsonify(response_data)

@app.route("/hint", methods=["GET"])
def get_hint():
    if not game_state["word"]:
        return jsonify({"error": "No active game"}), 400
        
    if not game_state["hint"]:
        game_state["hint"] = get_ai_hint(game_state["word"])
        
    return jsonify({"hint": game_state["hint"]})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
