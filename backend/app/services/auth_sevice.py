from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import UserRegister


class AuthService:

    def __init__(self, db: Session):
        self.db = db

    def register(self, user_data: UserRegister):

        existing = self.db.scalar(
            select(User).where(User.email == user_data.email)
        )

        if existing:
            raise ValueError("Email already registered")

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            role=user_data.role,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user

    def authenticate(self, email: str, password: str):

        user = self.db.scalar(
            select(User).where(User.email == email)
        )

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user