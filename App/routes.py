from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from App.models import db, User, Book, Borrow
from App.utils import role_required
from datetime import datetime

auth_blueprint = Blueprint('auth', __name__)
book_blueprint = Blueprint('book', __name__)
user_blueprint = Blueprint('user', __name__)

# User Registration
@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "User already exists"}), 400

    user = User(username=data['username'], role=data['role'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

# User Login
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Invalid credentials"}), 401

# Librarian actions
@book_blueprint.route('/books', methods=['POST'])
@jwt_required()
@role_required('LIBRARIAN')
def add_book():
    data = request.json
    book = Book(title=data['title'], author=data['author'])
    db.session.add(book)
    db.session.commit()
    return jsonify({"msg": "Book added"}), 201

@book_blueprint.route('/books/<int:book_id>', methods=['PUT'])
@jwt_required()
@role_required('LIBRARIAN')
def update_book(book_id):
    data = request.json
    book = Book.query.get_or_404(book_id)
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    db.session.commit()
    return jsonify({"msg": "Book updated"}), 200

@book_blueprint.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required()
@role_required('LIBRARIAN')
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"msg": "Book deleted"}), 200

@user_blueprint.route('/users', methods=['POST'])
@jwt_required()
@role_required('LIBRARIAN')
def add_member():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "User already exists"}), 400

    user = User(username=data['username'], role='MEMBER')
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Member added"}), 201

@user_blueprint.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required('LIBRARIAN')
def update_member(user_id):
    data = request.json
    user = User.query.get_or_404(user_id)
    user.username = data.get('username', user.username)
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify({"msg": "Member updated"}), 200

@user_blueprint.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required('LIBRARIAN')
def delete_member(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Member deleted"}), 200

@user_blueprint.route('/users', methods=['GET'])
@jwt_required()
@role_required('LIBRARIAN')
def view_members():
    users = User.query.filter_by(role='MEMBER').all()
    return jsonify([{"id": user.id, "username": user.username} for user in users]), 200

# Member actions
@book_blueprint.route('/books', methods=['GET'])
@jwt_required()
@role_required('MEMBER')
def view_books():
    books = Book.query.all()
    return jsonify([{"id": book.id, "title": book.title, "author": book.author, "status": book.status} for book in books]), 200

@book_blueprint.route('/books/<int:book_id>/borrow', methods=['POST'])
@jwt_required()
@role_required('MEMBER')
def borrow_book(book_id):
    book = Book.query.get_or_404(book_id)
    if book.status == 'BORROWED':
        return jsonify({"msg": "Book already borrowed"}), 400

    user_id = get_jwt_identity()
    borrow = Borrow(book_id=book.id, user_id=user_id, borrow_date=datetime.now())
    book.status = 'BORROWED'
    db.session.add(borrow)
    db.session.commit()
    return jsonify({"msg": "Book borrowed"}), 200

@book_blueprint.route('/books/<int:book_id>/return', methods=['POST'])
@jwt_required()
@role_required('MEMBER')
def return_book(book_id):
    book = Book.query.get_or_404(book_id)
    if book.status == 'AVAILABLE':
        return jsonify({"msg": "Book is not borrowed"}), 400

    user_id = get_jwt_identity()
    borrow = Borrow.query.filter_by(book_id=book.id, user_id=user_id, return_date=None).first()
    if not borrow:
        return jsonify({"msg": "No record of borrowing"}), 400

    borrow.return_date = datetime.now()
    book.status = 'AVAILABLE'
    db.session.commit()
    return jsonify({"msg": "Book returned"}), 200

@user_blueprint.route('/users/me', methods=['DELETE'])
@jwt_required()
@role_required('MEMBER')
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Account deleted"}), 200
