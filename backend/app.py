from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    
    # Replace with your desired hardcoded reply
    hardcoded_reply = "This is a hardcoded reply from the Flask backend."

    return jsonify({'reply': hardcoded_reply})

if __name__ == '__main__':
    app.run(debug=True)