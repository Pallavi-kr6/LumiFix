from flask import Flask, request, jsonify
from flask_cors import CORS
from image_processor import ImageProcessor
import json
import base64
import io
import traceback

app = Flask(__name__)
CORS(app)

processor = ImageProcessor()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "LumiFix AI Backend Ready"})

@app.route('/process', methods=['POST'])
def process_image():
    try:
        file = request.files['image']
        if not file:
            return jsonify({"success": False, "error": "No image file"}), 400
            
        params_str = request.form.get('params', '{}')
        params_dict = json.loads(params_str)
        
        image_bytes = file.read()
        if len(image_bytes) == 0:
            return jsonify({"success": False, "error": "Empty image data"}), 400
            
        processed_base64 = processor.process_image(image_bytes, params_dict)
        
        return jsonify({
            "success": True,
            "processed_image": processed_base64,
            "message": "Image processed successfully"
        })
    except Exception as e:
        error_str = f"{str(e)}\n{traceback.format_exc()}"
        print(f"Processing error: {error_str}")  # Terminal log
        return jsonify({"success": False, "error": error_str}), 500

@app.route('/upload', methods=['POST'])
def upload():
    try:
        file = request.files['image']
        filename = file.filename
        file.save(f"uploads/{filename}")
        return jsonify({"success": True, "filename": filename})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

