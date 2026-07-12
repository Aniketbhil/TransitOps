from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.utils.enums import VehicleStatus


class VehicleService:

    def __init__(self, db: Session):
        self.db = db

    def create_vehicle(self, vehicle_data: VehicleCreate):

        existing_vehicle = self.db.scalar(
            select(Vehicle).where(
                Vehicle.registration_number == vehicle_data.registration_number
            )
        )

        if existing_vehicle:
            raise ValueError("Vehicle with this registration number already exists.")

        vehicle = Vehicle(**vehicle_data.model_dump())

        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)

        return vehicle

    def get_all_vehicles(
        self,
        search: str | None = None,
        status: VehicleStatus | None = None,
        vehicle_type: str | None = None,
    ):

        query = select(Vehicle)

        if search:
            query = query.where(
                or_(
                    Vehicle.name.ilike(f"%{search}%"),
                    Vehicle.registration_number.ilike(f"%{search}%"),
                )
            )

        if status:
            query = query.where(
                Vehicle.status == status
            )

        if vehicle_type:
            query = query.where(
                Vehicle.vehicle_type.ilike(f"%{vehicle_type}%")
            )

        return self.db.scalars(query).all()

    def get_vehicle_by_id(self, vehicle_id: UUID):

        vehicle = self.db.get(Vehicle, vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        return vehicle

    def update_vehicle(
        self,
        vehicle_id: UUID,
        vehicle_data: VehicleUpdate,
    ):

        vehicle = self.db.get(Vehicle, vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        existing_vehicle = self.db.scalar(
            select(Vehicle).where(
                Vehicle.registration_number == vehicle_data.registration_number,
                Vehicle.id != vehicle_id,
            )
        )

        if existing_vehicle:
            raise ValueError("Vehicle with this registration number already exists.")

        for key, value in vehicle_data.model_dump().items():
            setattr(vehicle, key, value)

        self.db.commit()
        self.db.refresh(vehicle)

        return vehicle

    def delete_vehicle(self, vehicle_id: UUID):

        vehicle = self.db.get(Vehicle, vehicle_id)

        if not vehicle:
            raise ValueError("Vehicle not found.")

        self.db.delete(vehicle)
        self.db.commit()

        return {"message": "Vehicle deleted successfully."}

    def get_available_vehicles(self):
        return self.db.scalars(
            select(Vehicle).where(
                Vehicle.status == VehicleStatus.AVAILABLE
            )
        ).all()