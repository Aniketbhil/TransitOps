from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import TripStatus


class TripCreate(BaseModel):
    source: str
    destination: str
    vehicle_id: UUID
    driver_id: UUID
    cargo_weight: float = Field(gt=0)
    planned_distance: float = Field(gt=0)


class TripComplete(BaseModel):
    final_odometer: float = Field(ge=0)
    fuel_consumed: float = Field(gt=0)


class TripResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    source: str
    destination: str
    vehicle_id: UUID
    driver_id: UUID
    cargo_weight: float
    planned_distance: float
    final_odometer: float | None
    fuel_consumed: float | None
    status: TripStatus
    created_at: datetime


class TripListResponse(BaseModel):
    id: UUID

    source: str
    destination: str

    vehicle_id: UUID
    vehicle_name: str

    driver_id: UUID
    driver_name: str

    cargo_weight: float
    planned_distance: float

    status: TripStatus

    created_at: datetime