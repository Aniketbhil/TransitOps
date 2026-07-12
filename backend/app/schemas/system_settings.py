from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SystemSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    depot_name: str
    currency: str
    distance_unit: str


class SystemSettingsUpdate(BaseModel):
    depot_name: str
    currency: str
    distance_unit: str