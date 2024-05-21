from flask import Flask, request, jsonify, send_from_directory
import os
from model import getAnswer
import uuid

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Home route to serve the upload form
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Upload route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # Generate a unique filename
        ext = os.path.splitext(file.filename)[1]
        unique_filename = str(uuid.uuid4()) + ext
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        return jsonify({'message': 'File uploaded successfully', 'filename': unique_filename}), 200

# Route to serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def model(prompt, image):
    # Call your model here
    return getAnswer(image, prompt)

# route to send a text prompt, an image filename, and return model response
@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.get_json()
    prompt = data.get('prompt')
    image = data.get('image')
    response = model(prompt, image)
    print(prompt, image)
    return jsonify({'response': response})

# Route to serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(STATIC_FOLDER, filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)