from flask import Flask, request, jsonify, session as flask_session
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import smtplib
from email.mime.text import MIMEText

# Create Flask app instance
app = Flask(__name__)

# Enable CORS with support for credentials (cookies, headers)
# Only allow requests from localhost:3000 (your frontend probably)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Set secret key for session encryption
app.secret_key = "your-secret-key"

# Set session lifetime to 1 hour
app.permanent_session_lifetime = timedelta(hours=1)

# Configure SQLAlchemy engine to use SQLite database located at given path
engine = create_engine("sqlite:///C:/Users/User/Desktop/users_login.db")

# Base class for model declarations using SQLAlchemy's ORM system
Base = declarative_base()




# Define User model mapped to 'users' table
class User(Base):
    __tablename__ = "users"  # Table name in database

    id = Column(Integer, primary_key=True)  # Primary key column
    username = Column(String(80), nullable=False, unique=True)  # Unique username
    email = Column(String(120), unique=True, nullable=False)    # Unique email
    password = Column(String(120), nullable=False)              # Hashed password


# Create a session factory bound to the engine
SessionFactory = sessionmaker(bind=engine)

# Use scoped_session to ensure thread safety by managing session instances per thread
Session = scoped_session(SessionFactory)


@app.route("/register", methods=["POST"])
def register():
    db_session = Session()  # Create a new DB session for this request
    try:
        # Get JSON payload from request
        data = request.get_json()

        # Extract username, email, and password fields from JSON
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validate required fields
        if not username or not email or not password:
            return jsonify({"message": "Username, email, and password are required."}), 400
        
        # Check if username already exists in database
        if db_session.query(User).filter_by(username=username).first():
            return jsonify({"message": "Username already taken."}), 409

        # Check if email already exists in database
        if db_session.query(User).filter_by(email=email).first():
            return jsonify({"message": "Email already in use."}), 409

        # Hash the password securely using pbkdf2:sha256 algorithm
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        # Create new User object
        new_user = User(username=username, email=email, password=hashed_password)

        # Add new user to session and commit to save in DB
        db_session.add(new_user)
        db_session.commit()

        # Return success message with HTTP 201 (Created)
        return jsonify({"message": f"Welcome {username}, you are now registered!"}), 201

    except Exception as e:
        # Rollback session if any error occurs during DB operations
        db_session.rollback()
        print(f"Error during registration: {e}")
        # Return generic server error message
        return jsonify({"message": "Server error"}), 500

    finally:
        # Always close the DB session to free resources
        db_session.close()


@app.route("/login", methods=["POST"])
def login():
    db_session = Session()  # New DB session for this request
    try:
        # Parse JSON request body
        data = request.get_json()
        # Extract username and password
        username = data.get("username")
        password = data.get("password")
        remember = data.get("remember", False)  # Get remember value, default to False

        # Validate input
        if not username or not password:
            return jsonify({"message": "Username and password are required."}), 400

        # Query user from DB by username
        user = db_session.query(User).filter_by(username=username).first()

        # Check if user exists and password matches hashed password
        if user and check_password_hash(user.password, password):
            flask_session.permanent = True  # Make session permanent (1 hour lifetime)
            flask_session.permanent = bool(remember)  # Set session lifetime based on remember
            flask_session["user"] = username  # Store username in session
            return jsonify({"message": "Login successful!"}), 200
        else:
            # Return error if credentials invalid
            return jsonify({"message": "Invalid username or password."}), 401

    except Exception as e:
        print(f"Error occurred during login: {str(e)}")
        # Return generic server error message
        return jsonify({"message": "Server error. Please try again later."}), 500

    finally:
        # Close DB session after request
        db_session.close()


@app.route("/logout", methods=["POST"])
def logout():
    # Remove 'user' key from session to log out
    flask_session.clear()
    return jsonify({"message": "Logged out successfully!"}), 200


@app.route("/check_auth", methods=["GET"])
def check_auth():
    # Check if user is logged in by checking session data
    if "user" in flask_session:
        return jsonify({"authenticated": True, "user": flask_session["user"]})
    # Return unauthenticated if no user in session
    return jsonify({"authenticated": False})


# Cleanup DB sessions after each app context teardown (optional safety)
@app.teardown_appcontext
def remove_session(exception=None):
    # Remove scoped session to avoid leaks
    Session.remove()

@app.route("/send-email", methods=["POST"])
def send_email():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    # Prepare email
    msg = MIMEText(f"Name: {name}\nEmail: {email}\nMessage: {message}")
    msg["Subject"] = "New Contact Form Message"
    msg["From"] = email
    msg["To"] = "ralphh.fahed@gmail.com"

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login("ralphh.fahed@gmail.com", "cnfbbepmrvhbgmum")
            server.send_message(msg)
        return jsonify({"success": True}), 200
    except Exception as e:
        print("Error sending email:", e)
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    # Run Flask app with debug enabled for development
    app.run(debug=True)
