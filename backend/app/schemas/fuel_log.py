from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FuelLogCreate(BaseModel):
    vehicle_id: UUID
    liters: float = Field(gt=0)
    cost: float = Field(gt=0)
    date: date


class FuelLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    vehicle_id: UUID
    liters: float
    cost: float
    date: date


class FuelLogListResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    vehicle_name: str
    liters: float
    cost: float
    date: date