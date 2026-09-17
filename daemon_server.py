from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/v1/models')
def models():
    return jsonify({"data": [{"id": "lysander-3.0", "object": "model"}]})

@app.route('/v1/chat/completions', methods=['POST'])
def chat():
    data = request.get_json()
    # this is your execution bridge
    print(f"Got: {data}")
    return jsonify({
        "choices": [{"message": {"content": "[DAEMON ONLINE] Command received, linked to Aurelius-Engine"}}]
    })

@app.route('/')
def root():
    return "LYSANDER-3.0 DAEMON ONLINE"

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080)
