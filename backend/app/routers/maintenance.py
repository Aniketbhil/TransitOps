from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceListResponse,
    MaintenanceResponse,
)
from app.services.maintenance_service import (
    MaintenanceService,
)

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"],
)


@router.post(
    "",
    response_model=MaintenanceResponse,
)
def create_maintenance(
    maintenance_data: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = MaintenanceService(db)

    try:
        return service.create_maintenance(
            maintenance_data
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "",
    response_model=list[MaintenanceListResponse],
)
def get_all_maintenance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = MaintenanceService(db)

    return service.get_all_maintenance()


@router.post(
    "/{maintenance_id}/complete",
    response_model=MaintenanceResponse,
)
def complete_maintenance(
    maintenance_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = MaintenanceService(db)

    try:
        return service.complete_maintenance(
            maintenance_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )