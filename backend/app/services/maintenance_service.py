from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.maintenance import Maintenance
from app.models.vehicle import Vehicle
from app.schemas.maintenance import MaintenanceCreate
from app.utils.enums import MaintenanceStatus, VehicleStatus


class MaintenanceService:

    def __init__(self, db: Session):
        self.db = db

    def create_maintenance(
        self,
        maintenance_data: MaintenanceCreate,
    ):

        vehicle = self.db.get(
            Vehicle,
            maintenance_data.vehicle_id,
        )

        if not vehicle:
            raise ValueError("Vehicle not found.")

        if vehicle.status == VehicleStatus.RETIRED:
            raise ValueError(
                "Retired vehicles cannot have maintenance."
            )

        if vehicle.status == VehicleStatus.IN_SHOP:
            raise ValueError(
                "Vehicle is already in maintenance."
            )

        maintenance = Maintenance(
            **maintenance_data.model_dump(),
            status=MaintenanceStatus.ACTIVE,
        )

        vehicle.status = VehicleStatus.IN_SHOP

        self.db.add(maintenance)

        self.db.commit()

        self.db.refresh(maintenance)

        return maintenance

    def get_all_maintenance(self):

        maintenance_logs = self.db.scalars(
            select(Maintenance)
        ).all()

        result = []

        for log in maintenance_logs:

            vehicle = self.db.get(
                Vehicle,
                log.vehicle_id,
            )

            result.append(
                {
                    "id": log.id,
                    "vehicle_id": log.vehicle_id,
                    "vehicle_name": vehicle.name if vehicle else "N/A",
                    "service_type": log.service_type,
                    "cost": log.cost,
                    "service_date": log.service_date,
                    "status": log.status,
                }
            )

        return result

    def complete_maintenance(
        self,
        maintenance_id: UUID,
    ):

        maintenance = self.db.get(
            Maintenance,
            maintenance_id,
        )

        if not maintenance:
            raise ValueError(
                "Maintenance record not found."
            )

        if maintenance.status != MaintenanceStatus.ACTIVE:
            raise ValueError(
                "Maintenance already completed."
            )

        vehicle = self.db.get(
            Vehicle,
            maintenance.vehicle_id,
        )

        if not vehicle:
            raise ValueError("Vehicle not found.")

        maintenance.status = MaintenanceStatus.COMPLETED

        if vehicle.status != VehicleStatus.RETIRED:
            vehicle.status = VehicleStatus.AVAILABLE

        self.db.commit()

        self.db.refresh(maintenance)

        return maintenance