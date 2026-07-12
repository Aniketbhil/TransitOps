from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.driver import Driver
from app.models.expense import Expense
from app.models.fuel_log import FuelLog
from app.models.maintenance import Maintenance
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.utils.enums import (
    DriverStatus,
    TripStatus,
    VehicleStatus,
)


class DashboardService:

    def __init__(self, db: Session):
        self.db = db

    def get_dashboard(self):

        vehicles = self.db.scalars(select(Vehicle)).all()
        drivers = self.db.scalars(select(Driver)).all()
        trips = self.db.scalars(select(Trip)).all()
        maintenance_logs = self.db.scalars(select(Maintenance)).all()
        fuel_logs = self.db.scalars(select(FuelLog)).all()
        expenses = self.db.scalars(select(Expense)).all()

        active_vehicles = len(
            [
                v
                for v in vehicles
                if v.status != VehicleStatus.RETIRED
            ]
        )

        available_vehicles = len(
            [
                v
                for v in vehicles
                if v.status == VehicleStatus.AVAILABLE
            ]
        )

        in_shop = len(
            [
                v
                for v in vehicles
                if v.status == VehicleStatus.IN_SHOP
            ]
        )

        on_trip = len(
            [
                v
                for v in vehicles
                if v.status == VehicleStatus.ON_TRIP
            ]
        )

        retired = len(
            [
                v
                for v in vehicles
                if v.status == VehicleStatus.RETIRED
            ]
        )

        active_trips = len(
            [
                t
                for t in trips
                if t.status == TripStatus.DISPATCHED
            ]
        )

        pending_trips = len(
            [
                t
                for t in trips
                if t.status == TripStatus.DRAFT
            ]
        )

        completed_trips = len(
            [
                t
                for t in trips
                if t.status == TripStatus.COMPLETED
            ]
        )

        cancelled_trips = len(
            [
                t
                for t in trips
                if t.status == TripStatus.CANCELLED
            ]
        )

        drivers_on_trip = len(
            [
                d
                for d in drivers
                if d.status == DriverStatus.ON_TRIP
            ]
        )

        fleet_utilization = (
            round((on_trip / active_vehicles) * 100, 2)
            if active_vehicles
            else 0
        )

        total_fuel_cost = sum(
            fuel.cost for fuel in fuel_logs
        )

        total_maintenance_cost = sum(
            maintenance.cost
            for maintenance in maintenance_logs
        )

        total_other_expenses = sum(
            expense.amount
            for expense in expenses
        )

        total_operational_cost = (
            total_fuel_cost
            + total_maintenance_cost
            + total_other_expenses
        )

        total_distance = sum(
            trip.planned_distance
            for trip in trips
            if trip.fuel_consumed
        )

        total_fuel = sum(
            trip.fuel_consumed
            for trip in trips
            if trip.fuel_consumed
        )

        average_fuel_efficiency = (
            round(total_distance / total_fuel, 2)
            if total_fuel
            else None
        )

        recent_trips = []

        latest = sorted(
            trips,
            key=lambda trip: trip.created_at,
            reverse=True,
        )[:5]

        for trip in latest:

            vehicle = self.db.get(
                Vehicle,
                trip.vehicle_id,
            )

            driver = self.db.get(
                Driver,
                trip.driver_id,
            )

            recent_trips.append(
                {
                    "id": trip.id,
                    "source": trip.source,
                    "destination": trip.destination,
                    "vehicle_name": vehicle.name,
                    "driver_name": driver.name,
                    "status": trip.status,
                    "created_at": trip.created_at,
                }
            )

        return {
            "kpis": {
                "active_vehicles": active_vehicles,
                "available_vehicles": available_vehicles,
                "vehicles_in_maintenance": in_shop,
                "active_trips": active_trips,
                "pending_trips": pending_trips,
                "completed_trips": completed_trips,
                "cancelled_trips": cancelled_trips,
                "drivers_on_trip": drivers_on_trip,
                "fleet_utilization": fleet_utilization,
            },
            "vehicle_status": {
                "available": available_vehicles,
                "on_trip": on_trip,
                "in_shop": in_shop,
                "retired": retired,
            },
            "analytics": {
                "total_fuel_cost": total_fuel_cost,
                "total_maintenance_cost": total_maintenance_cost,
                "total_other_expenses": total_other_expenses,
                "total_operational_cost": total_operational_cost,
                "total_fuel_consumed": total_fuel,
                "average_fuel_efficiency": average_fuel_efficiency,
            },
            "recent_trips": recent_trips,
        }