from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.driver import Driver
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.trip import TripComplete, TripCreate
from app.utils.enums import DriverStatus, TripStatus, VehicleStatus


class TripService:

    def __init__(self, db: Session):
        self.db = db

    def create_trip(self, trip_data: TripCreate):

        vehicle = self.db.get(Vehicle, trip_data.vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        driver = self.db.get(Driver, trip_data.driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        trip = Trip(
            **trip_data.model_dump(),
            status=TripStatus.DRAFT,
        )

        self.db.add(trip)
        self.db.commit()
        self.db.refresh(trip)

        return trip

    def get_all_trips(
    self,
    search: str | None = None,
    status: TripStatus | None = None,
    ):

        query = select(Trip)

        if search:
            query = query.where(
                (Trip.source.ilike(f"%{search}%"))
                | (Trip.destination.ilike(f"%{search}%"))
            )

        if status:
            query = query.where(
                Trip.status == status
            )

        trips = self.db.scalars(query).all()

        result = []

        for trip in trips:

            vehicle = self.db.get(Vehicle, trip.vehicle_id)
            driver = self.db.get(Driver, trip.driver_id)

            result.append(
                {
                    "id": trip.id,
                    "source": trip.source,
                    "destination": trip.destination,
                    "vehicle_id": trip.vehicle_id,
                    "vehicle_name": vehicle.name if vehicle else "N/A",
                    "driver_id": trip.driver_id,
                    "driver_name": driver.name if driver else "N/A",
                    "cargo_weight": trip.cargo_weight,
                    "planned_distance": trip.planned_distance,
                    "status": trip.status,
                    "created_at": trip.created_at,
                }
            )

        return result
    
    def get_trip_by_id(self, trip_id: UUID):

        trip = self.db.get(Trip, trip_id)

        if not trip:
            raise ValueError("Trip not found.")

        return trip

    def dispatch_trip(self, trip_id: UUID):

        trip = self.db.get(Trip, trip_id)

        if not trip:
            raise ValueError("Trip not found.")

        if trip.status != TripStatus.DRAFT:
            raise ValueError("Only draft trips can be dispatched.")

        vehicle = self.db.get(Vehicle, trip.vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        driver = self.db.get(Driver, trip.driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        if vehicle.status != VehicleStatus.AVAILABLE:
            raise ValueError("Vehicle is not available.")

        if driver.status != DriverStatus.AVAILABLE:
            raise ValueError("Driver is not available.")

        if driver.license_expiry < date.today():
            raise ValueError("Driver license has expired.")

        if trip.cargo_weight > vehicle.max_load_capacity:
            raise ValueError("Cargo exceeds vehicle capacity.")

        trip.status = TripStatus.DISPATCHED

        vehicle.status = VehicleStatus.ON_TRIP

        driver.status = DriverStatus.ON_TRIP

        self.db.commit()

        self.db.refresh(trip)
        self.db.refresh(vehicle)
        self.db.refresh(driver)

        return trip

    def complete_trip(
        self,
        trip_id: UUID,
        data: TripComplete,
    ):

        trip = self.db.get(Trip, trip_id)

        if not trip:
            raise ValueError("Trip not found.")

        if trip.status != TripStatus.DISPATCHED:
            raise ValueError("Trip is not dispatched.")

        vehicle = self.db.get(Vehicle, trip.vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        driver = self.db.get(Driver, trip.driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        if data.final_odometer < vehicle.odometer:
            raise ValueError(
                "Final odometer cannot be less than the current vehicle odometer."
            )

        trip.final_odometer = data.final_odometer
        trip.fuel_consumed = data.fuel_consumed
        trip.status = TripStatus.COMPLETED

        vehicle.odometer = data.final_odometer
        vehicle.status = VehicleStatus.AVAILABLE

        driver.status = DriverStatus.AVAILABLE

        self.db.commit()

        self.db.refresh(trip)
        self.db.refresh(vehicle)
        self.db.refresh(driver)

        return trip

    def cancel_trip(self, trip_id: UUID):

        trip = self.db.get(Trip, trip_id)

        if not trip:
            raise ValueError("Trip not found.")

        if trip.status != TripStatus.DISPATCHED:
            raise ValueError("Only dispatched trips can be cancelled.")

        vehicle = self.db.get(Vehicle, trip.vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        driver = self.db.get(Driver, trip.driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        trip.status = TripStatus.CANCELLED

        vehicle.status = VehicleStatus.AVAILABLE

        driver.status = DriverStatus.AVAILABLE

        self.db.commit()

        self.db.refresh(trip)
        self.db.refresh(vehicle)
        self.db.refresh(driver)

        return trip