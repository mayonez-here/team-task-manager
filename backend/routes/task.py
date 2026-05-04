from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Task, Project, User
from app.extensions import db
from datetime import datetime, date

task_routes = Blueprint('task', __name__)


# ----------------------------
# HELPER (KEEP SIMPLE)
# ----------------------------
def is_admin(user):
    return user.role == "admin"


def is_project_member(user, project):
    return user in project.members


# ----------------------------
# CREATE TASK (ADMIN ONLY)
# ----------------------------
@task_routes.route('/create-task', methods=['POST'])
@jwt_required()
def create_task():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)
    project = Project.query.get(data['project_id'])

    if not project:
        return jsonify({"msg": "Project not found"}), 404

    # 🔐 ONLY ADMIN CAN CREATE TASK
    if not is_admin(user):
        return jsonify({"msg": "Only admin can create tasks"}), 403

    due_date = datetime.strptime(data['due_date'], "%Y-%m-%d")

    task = Task(
        title=data['title'],
        description=data.get('description'),
        priority=data.get('priority', 'medium'),
        due_date=due_date,
        assigned_to=data['assigned_to'],
        project_id=data['project_id']
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"msg": "Task created"}), 201


# ----------------------------
# GET TASKS (MEMBERS + ADMIN)
# ----------------------------
@task_routes.route('/project-tasks/<int:project_id>', methods=['GET'])
@jwt_required()
def get_tasks(project_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    project = Project.query.get(project_id)

    if not project:
        return jsonify({"msg": "Project not found"}), 404

    # members + admin allowed
    if not (is_admin(user) or is_project_member(user, project)):
        return jsonify({"msg": "Not allowed"}), 403

    tasks = Task.query.filter_by(project_id=project_id).all()

    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "assigned_to": t.assigned_to
        }
        for t in tasks
    ])


# ----------------------------
# UPDATE TASK (MEMBERS + ADMIN)
# ----------------------------
@task_routes.route('/update-task/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    data = request.get_json()
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"msg": "Task not found"}), 404

    project = Project.query.get(task.project_id)

    if not project:
        return jsonify({"msg": "Project not found"}), 404

    # members can update status
    if not (is_admin(user) or is_project_member(user, project)):
        return jsonify({"msg": "Not allowed"}), 403

    if data.get("status") not in ["pending", "done"]:
        return jsonify({"msg": "Invalid status"}), 400

    task.status = data["status"]
    db.session.commit()

    return jsonify({"msg": "Task updated"})


# ----------------------------
# DELETE TASK (ADMIN ONLY)
# ----------------------------
@task_routes.route('/delete-task/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"msg": "Task not found"}), 404

    project = Project.query.get(task.project_id)

    if not project:
        return jsonify({"msg": "Project not found"}), 404

    # 🔐 ONLY ADMIN CAN DELETE TASK
    if not is_admin(user):
        return jsonify({"msg": "Only admin can delete tasks"}), 403

    db.session.delete(task)
    db.session.commit()

    return jsonify({"msg": "Task deleted"})


# ----------------------------
# DASHBOARD
# ----------------------------
@task_routes.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # get all projects user belongs to
    projects = user.projects

    project_ids = [p.id for p in projects]

    # ALL tasks in those projects (NOT just assigned_to)
    tasks = Task.query.filter(Task.project_id.in_(project_ids)).all()

    total = len(tasks)
    completed = len([t for t in tasks if t.status == "done"])
    pending = len([t for t in tasks if t.status != "done"])

    overdue = len([
        t for t in tasks
        if t.due_date and t.due_date < date.today() and t.status != "done"
    ])

    return jsonify({
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "overdue_tasks": overdue
    })