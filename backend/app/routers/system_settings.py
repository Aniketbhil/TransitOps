from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.schemas.system_settings import (
    SystemSettingsResponse,
    SystemSettingsUpdate,
)
from app.services.system_settings_service import (
    SystemSettingsService,
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get(
    "",
    response_model=SystemSettingsResponse,
)
def get_settings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = SystemSettingsService(db)

    return service.get_settings()


@router.put(
    "",
    response_model=SystemSettingsResponse,
)
def update_settings(
    data: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = SystemSettingsService(db)

    return service.update_settings(data)