from flask import request, jsonify
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from App.models import User

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role != role:
                return jsonify({"msg": "Permission denied"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def response_with(data=None, message=None, code=200):
    response = {
        'data': data,
        'message': message
    }
    return jsonify(response), code
