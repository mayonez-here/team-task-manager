from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Project, User
from app.extensions import db

project_routes = Blueprint('project', __name__)

@project_routes.route('/create-project', methods=['POST'])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json()

    # 🔐 STEP 1: check role (security)
    user = User.query.get(user_id)

    if user.role != "admin":
        return jsonify({"msg": "Only admin can create projects"}), 403

    # 🔐 STEP 2: validate input
    if not data or not data.get("name"):
        return jsonify({"msg": "Project name required"}), 400

    # 📦 STEP 3: create project
    project = Project(
        name=data['name'],
        created_by=user_id
    )

    # 👥 STEP 4: add creator as member
    project.members.append(user)

    # 💾 STEP 5: save
    db.session.add(project)
    db.session.commit()

    return jsonify({"msg": "Project created"})

@project_routes.route('/my-projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "is_owner": p.created_by == user_id
        }
        for p in user.projects
    ])

@project_routes.route('/add-member', methods=['POST'])
@jwt_required()
def add_member():
    data = request.get_json()
    user_id = get_jwt_identity()

    project = Project.query.get(data.get('project_id'))
    target_user = User.query.get(data.get('user_id'))
    current_user = User.query.get(user_id)

    if not project:
        return jsonify({"msg": "Project not found"}), 404

    if not target_user:
        return jsonify({"msg": "User not found"}), 404

    # ONLY ADMIN OR CREATOR
    if project.created_by != user_id and current_user.role != "admin":
        return jsonify({"msg": "Not allowed"}), 403

    # prevent duplicate
    if target_user in project.members:
        return jsonify({"msg": "User already added"}), 400

    project.members.append(target_user)
    db.session.commit()

    return jsonify({"msg": "Member added"})

@project_routes.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # 🔐 ONLY ADMIN CAN ACCESS
    if user.role != "admin":
        return jsonify({"msg": "Not allowed"}), 403

    users = User.query.all()

    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ])

@project_routes.route('/project-members/<int:project_id>', methods=['GET'])
@jwt_required()
def project_members(project_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    project = Project.query.get(project_id)

    if not project:
        return jsonify({"msg": "Project not found"}), 404

    # only admin OR project members can view
    if user.role != "admin" and user not in project.members:
        return jsonify({"msg": "Not allowed"}), 403

    return jsonify({
        "project": project.name,
        "members": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role
            }
            for u in project.members
        ]
    })