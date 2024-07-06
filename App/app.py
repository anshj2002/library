from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from App.models import db

app = Flask(__name__)
app.config.from_object('config.Config')

db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

from App.routes import auth_blueprint, book_blueprint, user_blueprint
app.register_blueprint(auth_blueprint)
app.register_blueprint(book_blueprint)
app.register_blueprint(user_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
