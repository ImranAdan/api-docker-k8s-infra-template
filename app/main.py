from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World from Flask"

@app.route("/post", methods = ['POST'])
def post():
    payload = request.get_json()
    return jsonify(payload)

@app.route("/health", methods = ['GET'])
def health():
    return jsonify(success=True)

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=8080) # change the port here depending on your container mapping. 