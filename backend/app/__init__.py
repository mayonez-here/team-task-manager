# app/__init__.py
from flask import Flask
from app.extensions import db, jwt
from config import Config
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    from routes.auth import auth_routes
    app.register_blueprint(auth_routes)
    from routes.project import project_routes
    app.register_blueprint(project_routes)
    from routes.task import task_routes
    app.register_blueprint(task_routes)
    jwt.init_app(app)

    @app.route("/")
    def home():
        return "Server is running perfectly"

    return app