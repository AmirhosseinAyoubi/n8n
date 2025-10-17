from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import time

app = Flask(__name__)

MAX_IMAGE_BYTES = int(os.getenv("MAX_IMAGE_BYTES", str(1 *1024 * 1024)))  # 1 MB default

@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    request_id = request.form.get("requestId")
    file = request.files.get("image")
    if file is None:
        return jsonify({"error": "No image provided", "requestId": request_id}), 400

    filename = secure_filename(file.filename or "upload")
    try:
        # Simulate processing delay
        time.sleep(3)

        content = file.read()
        size_bytes = len(content)
        status = "Large" if size_bytes > MAX_IMAGE_BYTES else "Low"
        return jsonify({
            "filename": filename,
            "sizeBytes": size_bytes,
            "thresholdBytes": MAX_IMAGE_BYTES,
            "status": status,
            "requestId": request_id
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to process image", "details": str(e), "requestId": request_id}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
