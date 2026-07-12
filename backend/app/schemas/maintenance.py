from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import MaintenanceStatus


class MaintenanceCreate(BaseModel):
    vehicle_id: UUID
    service_type: str
    cost: float = Field(gt=0)
    service_date: date


class MaintenanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    vehicle_id: UUID
    service_type: str
    cost: float
    service_date: date
    status: MaintenanceStatus


class MaintenanceListResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    vehicle_name: str
    service_type: str
    cost: float
    service_date: date
    status: MaintenanceStatus