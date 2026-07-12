from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.utils.enums import TripStatus


class RecentTrip(BaseModel):
    id: UUID
    source: str
    destination: str
    vehicle_name: str
    driver_name: str
    status: TripStatus
    created_at: datetime


class DashboardKPIs(BaseModel):
    active_vehicles: int
    available_vehicles: int
    vehicles_in_maintenance: int
    active_trips: int
    pending_trips: int
    completed_trips: int
    cancelled_trips: int
    drivers_on_trip: int
    fleet_utilization: float


class VehicleStatusChart(BaseModel):
    available: int
    on_trip: int
    in_shop: int
    retired: int


class Analytics(BaseModel):
    total_fuel_cost: float
    total_maintenance_cost: float
    total_other_expenses: float
    total_operational_cost: float
    total_fuel_consumed: float
    average_fuel_efficiency: float | None


class DashboardResponse(BaseModel):
    kpis: DashboardKPIs
    vehicle_status: VehicleStatusChart
    analytics: Analytics
    recent_trips: list[RecentTrip]