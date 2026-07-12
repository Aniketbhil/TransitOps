from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.system_settings import SystemSettings
from app.schemas.system_settings import SystemSettingsUpdate


class SystemSettingsService:

    def __init__(self, db: Session):
        self.db = db

    def get_settings(self):

        settings = self.db.scalar(
            select(SystemSettings)
        )

        if not settings:

            settings = SystemSettings()

            self.db.add(settings)

            self.db.commit()

            self.db.refresh(settings)

        return settings

    def update_settings(
        self,
        data: SystemSettingsUpdate,
    ):

        settings = self.db.scalar(
            select(SystemSettings)
        )

        if not settings:

            settings = SystemSettings()

            self.db.add(settings)

            self.db.commit()

            self.db.refresh(settings)

        settings.depot_name = data.depot_name
        settings.currency = data.currency
        settings.distance_unit = data.distance_unit

        self.db.commit()
        self.db.refresh(settings)

        return settings