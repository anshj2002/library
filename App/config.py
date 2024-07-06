import os
import secrets
import base64
from dotenv import load_dotenv

load_dotenv()

secret_key = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')
jwt_key = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')

class Config:
    
    SECRET_KEY = os.getenv('SECRET_KEY', secret_key)

    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://username:password@localhost:5432/library')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', jwt_key)
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # Default to 1 hour
