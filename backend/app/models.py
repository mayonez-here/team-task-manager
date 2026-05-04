from app.extensions import db


# Association table (FIXED)
project_members = db.Table(
    'project_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),   # ✅ FIXED
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))  # ✅ OK
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    role = db.Column(db.String(10), default="member")

    # Relationships
    projects = db.relationship(
        'Project',
        secondary=project_members,
        back_populates='members'
    )

    tasks = db.relationship('Task', back_populates='assigned_user')


class Project(db.Model):
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))  # ✅ FIXED

    # Relationships
    members = db.relationship(
        'User',
        secondary=project_members,
        back_populates='projects'
    )

    tasks = db.relationship('Task', back_populates='project')


class Task(db.Model):
    __tablename__ = "task"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))

    status = db.Column(db.String(20), default="pending")
    priority = db.Column(db.String(10), default="medium")

    due_date = db.Column(db.Date)

    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))  # ✅ FIXED
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))

    # Relationships
    assigned_user = db.relationship('User', back_populates='tasks')
    project = db.relationship('Project', back_populates='tasks')