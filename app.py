from flask import Flask, render_template, request, redirect, flash, session, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2 import OperationalError, InterfaceError
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import jwt
from datetime import datetime, timedelta
import configparser
import logging
from functools import wraps
import base64


app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'static/uploads/profile_images'  
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  

'''function to read the config and extract the secret key'''

def get_flask_config(filename="database.ini", section="flask"):
    parser = configparser.ConfigParser()
    parser.read(filename)

    # Extracting key
    if parser.has_section(section):
        return parser.get(section, "secret_key")
    else:
        raise Exception(f"Section {section} not found in {filename}")


app.secret_key = get_flask_config()
JWT_SECRET_KEY = app.secret_key 
JWT_EXPIRATION_TIME = timedelta(days=1)

def config(filename="database.ini", section="postgresql"):

    parser = configparser.ConfigParser()

    parser.read(filename)

    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception(f"Section {section} not found in the {filename} file")

    return db

#Connection to postgres using database.ini 
def create_connection():
    """Create a database connection and return the connection and cursor."""
    
    params = config()
    try:
        connection = psycopg2.connect(**params)
        cursor = connection.cursor()
        print("Database connection successful")
        return connection, cursor
    except (OperationalError, InterfaceError) as e:
        print(f"Error connecting to the database: {e}")
        return None, None

# Usage
connection, cursor = create_connection()


'''**********File handling**********'''
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

'''*********************Routes***********************'''

@app.route("/api/signup", methods=["POST"])
def handlesignup():
    try:
        if not request.json:
            return jsonify({"message": "Request must be JSON", "status": "danger"}), 400

        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        cpassword = data.get("cpassword")
        profile_image = data.get("profile_image")  # Base64 string

        # Basic checks
        if not email or not password or not cpassword:
            return jsonify({"message": "Email, password, and confirm password are required", "status": "danger"}), 400

        if len(email) < 5 or len(email) > 50:
            return jsonify({"message": "Email must be between 5 and 50 characters long", "status": "danger"}), 400

        if not ("@" in email and "." in email):
            return jsonify({"message": "Invalid email format", "status": "danger"}), 400

        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user:
            return jsonify({"message": "This email is already registered", "status": "danger"}), 400

        if len(password) < 6:
            return jsonify({"message": "Password must contain at least 6 characters", "status": "danger"}), 400

        if password != cpassword:
            return jsonify({"message": "Both password and confirm password should match", "status": "danger"}), 400


        if profile_image:
            # Get the file extension from the data URL
            file_extension = "jpg"  # Default to jpg
            filename = f"{secure_filename(name)}.{file_extension}"  # Create a unique filename
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            # Decode the image and save it
            with open(image_path, "wb") as fh:
                fh.write(base64.b64decode(profile_image))

        # Hashing the password
        hashed_pass = generate_password_hash(password)
        
        # Insert user into the database
        cursor.execute("INSERT INTO users (email, name, password, profile_image, timestamp) VALUES (%s, %s, %s, %s, %s) ",
                       (email, name, hashed_pass, filename, datetime.utcnow()))
        connection.commit()

        # JWT token
        token = jwt.encode({
            'user': email,
            'exp': datetime.utcnow() + JWT_EXPIRATION_TIME
        }, JWT_SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Your account has been successfully created", "status": "success", "token": token}), 201

    except Exception as e:
        logging.error("Error occurred during signup: %s", e)
        return jsonify({"message": f"An error occurred: {str(e)}", "status": "danger"}), 500


@app.route("/api/login", methods=["POST"])
def api_login():
    if request.content_type != 'application/json':
        return jsonify({"message": "Content-Type must be application/json", "status": "danger"}), 415
    
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email and password are required", "status": "danger"}), 400 

    cursor.execute("SELECT * FROM users WHERE email=%s", [email])
    user = cursor.fetchone()

    if user and check_password_hash(user[2], password):
        # JWT token
        token = jwt.encode({
            'user': email,
            'exp': datetime.now(datetime.timezone.utc) + JWT_EXPIRATION_TIME
        }, JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({"message": "Login successful", "status": "success", "token": token}), 200
    else:
        return jsonify({"message": "Invalid email or password", "status": "danger"}), 401



@app.route("/api/logout", methods=["POST"])
def api_logout():
    return jsonify({"message": "Logged out successfully. Please discard your token.", "status": "success"}), 200

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = request.headers.get('Authorization')
#         if not token:
#             return jsonify({'message': 'Token is missing!', 'status': 'danger'}), 401
#         try:
#             data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
#             current_user = data['user']
#         except jwt.ExpiredSignatureError:
#             return jsonify({'message': 'Token has expired!', 'status': 'danger'}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({'message': 'Invalid token!', 'status': 'danger'}), 401

#         return f(current_user, *args, **kwargs)

#     return decorated

if __name__ == "__main__":
    app.run(debug=True)
