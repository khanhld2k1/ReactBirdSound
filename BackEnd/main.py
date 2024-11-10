import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import librosa
import json
from flask_cors import CORS
from warnings import filterwarnings
filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Load the prediction dictionary and model once during startup
with open('prediction.json', 'r') as f:
    prediction_dict = json.load(f)
model = tf.keras.models.load_model('model2.keras')

@app.route('/predict', methods=['POST'])
def predict_audio():
    # Check if a file part is present
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    # Check if the file is in an allowed format
    if file.filename == '' or not (file.filename.endswith('.mp3') or file.filename.endswith('.wav')):
        return jsonify({"error": "Invalid file type. Only .mp3 and .wav files are allowed."}), 400

    try:
        # Load audio file
        audio, sample_rate = librosa.load(file)
    except Exception as e:
        return jsonify({"error": f"Error processing audio: {str(e)}"}), 500

    # Extract MFCC features
    mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    mfccs_features = np.mean(mfccs_features, axis=1)
    
    mfccs_features = np.expand_dims(mfccs_features, axis=0)
    mfccs_features = np.expand_dims(mfccs_features, axis=2)

    # Convert to tensor and predict
    mfccs_tensors = tf.convert_to_tensor(mfccs_features, dtype=tf.float32)

    prediction = model.predict(mfccs_tensors)

    # Get prediction and confidence
    target_label = np.argmax(prediction)

    predicted_class = prediction_dict[str(target_label)]
    confidence = round(np.max(prediction) * 100, 2)

    # Return JSON response
    return jsonify({
        "predicted_class": predicted_class,
        "confidence": f"{confidence}%",
        
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
