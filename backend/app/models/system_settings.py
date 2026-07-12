import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.core.database import Base


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    depot_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="Main Depot",
    )

    currency: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="INR",
    )

    distance_unit: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="KM",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )