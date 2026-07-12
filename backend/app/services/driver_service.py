from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate
from app.utils.enums import DriverStatus


class DriverService:

    def __init__(self, db: Session):
        self.db = db

    def create_driver(self, driver_data: DriverCreate):

        existing_driver = self.db.scalar(
            select(Driver).where(
                Driver.license_number == driver_data.license_number
            )
        )

        if existing_driver:
            raise ValueError("Driver with this license number already exists.")

        driver = Driver(**driver_data.model_dump())

        self.db.add(driver)
        self.db.commit()
        self.db.refresh(driver)

        return driver

    def get_all_drivers(self):

        return self.db.scalars(
            select(Driver)
        ).all()

    def get_driver_by_id(self, driver_id: UUID):

        driver = self.db.get(Driver, driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        return driver

    def update_driver(
        self,
        driver_id: UUID,
        driver_data: DriverUpdate,
    ):

        driver = self.db.get(Driver, driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        existing_driver = self.db.scalar(
            select(Driver).where(
                Driver.license_number == driver_data.license_number,
                Driver.id != driver_id,
            )
        )

        if existing_driver:
            raise ValueError("Driver with this license number already exists.")

        for key, value in driver_data.model_dump().items():
            setattr(driver, key, value)

        self.db.commit()
        self.db.refresh(driver)

        return driver

    def delete_driver(self, driver_id: UUID):

        driver = self.db.get(Driver, driver_id)

        if not driver:
            raise ValueError("Driver not found.")

        self.db.delete(driver)
        self.db.commit()

        return {"message": "Driver deleted successfully."}
    
    def get_available_drivers(self):
        return self.db.scalars(
            select(Driver).where(
                Driver.status == DriverStatus.AVAILABLE
            )
        ).all()