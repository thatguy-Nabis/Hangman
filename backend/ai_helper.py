import os
import requests
import random

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama3-8b-8192"

FALLBACK_WORDS = ["HORIZON", "NEBULA", "SUPERNOVA", "GRAVITY", "ASTRONAUT", "GALAXY", "METEORITE", "ECLIPSE", "ORBIT", "PLANET", "COMET", "QUASAR"]
FALLBACK_HINTS = {
    "HORIZON": "The line at which the earth's surface and the sky appear to meet.",
    "NEBULA": "A giant cloud of dust and gas in space.",
    "SUPERNOVA": "A powerful and luminous stellar explosion.",
    "GRAVITY": "The invisible pull that keeps everything grounded.",
    "ASTRONAUT": "A person trained for traveling in space.",
    "GALAXY": "A massive system of stars, stellar remnants, interstellar gas, dust, and dark matter.",
    "METEORITE": "A solid piece of debris from an object, such as a comet, asteroid, or meteoroid.",
    "ECLIPSE": "When one celestial body obscures another.",
    "ORBIT": "Curved trajectory of an object.",
    "PLANET": "A celestial body moving in an elliptical orbit around a star.",
    "COMET": "A cosmic snowball of frozen gases, rock, and dust.",
    "QUASAR": "An extremely luminous active galactic nucleus."
}

def get_ai_word():
    if not GROQ_API_KEY:
        print("No GROQ_API_KEY found. Using fallback words.")
        return random.choice(FALLBACK_WORDS)
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a word game assistant. Return exactly ONE uppercase English word suitable for a challenging game of Hangman (between 5 and 12 letters long, preferably related to space/astronomy/science fiction or arcade games). Provide NO other text, punctuation, or quotation marks. Only the word."
            }
        ],
        "temperature": 0.9,
        "max_tokens": 15
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        word = data["choices"][0]["message"]["content"].strip().upper()
        # Ensure it's a single word with no spaces or weird characters
        word = "".join(filter(str.isalpha, word))
        if len(word) >= 4:
            return word
    except requests.exceptions.RequestException as e:
        print(f"Error fetching word from Groq: {e}")
        
    return random.choice(FALLBACK_WORDS)

def get_ai_hint(word):
    if not GROQ_API_KEY:
        return FALLBACK_HINTS.get(word, "A challenging word to guess.")
        
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant for a Hangman game."
            },
            {
                "role": "user",
                "content": f"Generate a short, cryptic and fun hint (max 10 words) for the word: '{word}'. Do NOT use the word itself in the hint."
            }
        ],
        "temperature": 0.7,
        "max_tokens": 30
    }
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        hint = data["choices"][0]["message"]["content"].strip()
        # Strip quotes if they were added
        if hint.startswith('"') and hint.endswith('"'):
            hint = hint[1:-1]
        return hint
    except requests.exceptions.RequestException as e:
        print(f"Error fetching hint from Groq: {e}")
        
    return FALLBACK_HINTS.get(word, "A challenging word to guess.")
