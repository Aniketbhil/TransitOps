from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import VehicleStatus


class VehicleCreate(BaseModel):
    registration_number: str
    name: str
    vehicle_type: str
    max_load_capacity: float = Field(gt=0)
    odometer: float = Field(ge=0)
    acquisition_cost: float = Field(ge=0)


class VehicleUpdate(BaseModel):
    registration_number: str
    name: str
    vehicle_type: str
    max_load_capacity: float = Field(gt=0)
    odometer: float = Field(ge=0)
    acquisition_cost: float = Field(ge=0)
    status: VehicleStatus


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    registration_number: str
    name: str
    vehicle_type: str
    max_load_capacity: float
    odometer: float
    acquisition_cost: float
    status: VehicleStatus