from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.schemas.fuel_log import (
    FuelLogCreate,
    FuelLogListResponse,
    FuelLogResponse,
)
from app.services.fuel_log_service import FuelLogService

router = APIRouter(
    prefix="/fuel-logs",
    tags=["Fuel Logs"],
)


@router.post(
    "",
    response_model=FuelLogResponse,
)
def create_fuel_log(
    fuel_log_data: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = FuelLogService(db)

    try:
        return service.create_fuel_log(
            fuel_log_data
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "",
    response_model=list[FuelLogListResponse],
)
def get_all_fuel_logs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    service = FuelLogService(db)

    return service.get_all_fuel_logs()