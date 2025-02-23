from flask import Flask, render_template, request, jsonify, send_from_directory, url_for
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Set upload folder to an absolute directory
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), "static", "uploads")
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max upload size: 16MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# File to store blog posts (using relative path)
BLOG_FILE = 'blog_posts.json'

# Simulated social media posts (replace with real API integration later)
SOCIAL_POSTS = [
    {"platform": "Twitter", "message": "Just installed our state-of-the-art HVAC system! #WesternAirTech"},
    {"platform": "Facebook", "message": "Our premium air purifiers are now in stock. Order today!"},
    {"platform": "Instagram", "message": "Experience comfort and efficiency with our latest heating solutions."}
]

# Initialize blog posts file if not present
if not os.path.exists(BLOG_FILE):
    with open(BLOG_FILE, 'w') as f:
        json.dump([], f)

# Helper function to check if the file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def index():
    return render_template("index.html")

# Serve static files (CSS, JS, images, uploads)
@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

# API: Get blog posts
@app.route("/get_posts", methods=["GET"])
def get_posts():
    try:
        with open(BLOG_FILE, 'r') as f:
            posts = json.load(f)
        return jsonify(posts)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# API: Add a new blog post
@app.route("/add_post", methods=["POST"])
def add_post():
    try:
        message = request.form.get("message", "")
        if not message:
            return jsonify({"status": "error", "message": "Message is required."}), 400
        
        file = request.files.get("file", None)
        image_url = ""
        video_url = ""
        
        if file:
            if not allowed_file(file.filename):
                return jsonify({"status": "error", "message": "File type not allowed."}), 400

            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Build a full URL for the uploaded file using request.host_url and url_for
            file_url = request.host_url.rstrip("/") + url_for("static_files", filename=f"uploads/{filename}")
            
            # Determine if file is image or video
            if file.content_type.startswith("image"):
                image_url = file_url
            elif file.content_type.startswith("video"):
                video_url = file_url
        
        new_post = {
            "user": "Anonymous",
            "message": message,
            "image": image_url,
            "video": video_url
        }
        
        with open(BLOG_FILE, 'r') as f:
            posts = json.load(f)
        
        posts.insert(0, new_post)  # Newest posts on top
        
        # Limit the number of posts in the file (store only the latest 50 posts)
        if len(posts) > 50:
            posts = posts[:50]

        with open(BLOG_FILE, 'w') as f:
            json.dump(posts, f)
        
        return jsonify({"status": "success", "post": new_post})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# API: Get social media updates
@app.route("/get_social_updates", methods=["GET"])
def get_social_updates():
    try:
        # Replace this hardcoded list with an actual API call later if needed
        return jsonify(SOCIAL_POSTS)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    # Run on all interfaces so the site is accessible on phones, tablets, and laptops
    app.run(host="0.0.0.0", port=5000, debug=True)
