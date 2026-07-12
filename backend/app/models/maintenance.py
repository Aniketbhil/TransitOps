import uuid
from datetime import date

from sqlalchemy import Date
from sqlalchemy import Enum
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.core.database import Base
from app.utils.enums import MaintenanceStatus


class Maintenance(Base):
    __tablename__ = "maintenance_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    vehicle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("vehicles.id"),
        nullable=False,
    )

    service_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    cost: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    service_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    status: Mapped[MaintenanceStatus] = mapped_column(
        Enum(MaintenanceStatus),
        default=MaintenanceStatus.ACTIVE,
        nullable=False,
    )