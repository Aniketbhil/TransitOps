from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fuel_log import FuelLog
from app.models.vehicle import Vehicle
from app.schemas.fuel_log import FuelLogCreate


class FuelLogService:

    def __init__(self, db: Session):
        self.db = db

    def create_fuel_log(
        self,
        fuel_log_data: FuelLogCreate,
    ):

        vehicle = self.db.get(
            Vehicle,
            fuel_log_data.vehicle_id,
        )

        if not vehicle:
            raise ValueError("Vehicle not found.")

        fuel_log = FuelLog(
            **fuel_log_data.model_dump(),
        )

        self.db.add(fuel_log)

        self.db.commit()

        self.db.refresh(fuel_log)

        return fuel_log

    def get_all_fuel_logs(self):

        fuel_logs = self.db.scalars(
            select(FuelLog)
        ).all()

        result = []

        for fuel_log in fuel_logs:

            vehicle = self.db.get(
                Vehicle,
                fuel_log.vehicle_id,
            )

            result.append(
                {
                    "id": fuel_log.id,
                    "vehicle_id": fuel_log.vehicle_id,
                    "vehicle_name": vehicle.name if vehicle else "N/A",
                    "liters": fuel_log.liters,
                    "cost": fuel_log.cost,
                    "date": fuel_log.date,
                }
            )

        return result