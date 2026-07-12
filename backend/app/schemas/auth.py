from pydantic import BaseModel, ConfigDict, EmailStr
from uuid import UUID

from app.utils.enums import Role


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Role


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    full_name: str
    email: EmailStr
    role: Role
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str