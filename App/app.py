from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from App.models import db
from App.config import Config
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)

app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

from App.routes import auth_blueprint, book_blueprint, user_blueprint
app.register_blueprint(auth_blueprint)
app.register_blueprint(book_blueprint)
app.register_blueprint(user_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
