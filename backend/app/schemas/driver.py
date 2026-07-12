from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import DriverStatus


class DriverCreate(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry: date
    contact_number: str
    safety_score: float = Field(ge=0, le=100)


class DriverUpdate(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry: date
    contact_number: str
    safety_score: float = Field(ge=0, le=100)
    status: DriverStatus


class DriverResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    license_number: str
    license_category: str
    license_expiry: date
    contact_number: str
    safety_score: float
    status: DriverStatus