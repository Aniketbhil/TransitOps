from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.schemas.driver import (
    DriverCreate,
    DriverResponse,
    DriverUpdate,
)
from app.services.driver_service import DriverService

router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"],
)


@router.post("", response_model=DriverResponse)
def create_driver(
    driver_data: DriverCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriverService(db)

    try:
        return service.create_driver(driver_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[DriverResponse])
def get_all_drivers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriverService(db)
    return service.get_all_drivers()

@router.get("/available", response_model=list[DriverResponse])
def get_available_drivers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriverService(db)
    return service.get_available_drivers()


@router.get("/{driver_id}", response_model=DriverResponse)
def get_driver(
    driver_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriverService(db)

    try:
        return service.get_driver_by_id(driver_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: UUID,
    driver_data: DriverUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriverService(db)

    try:
        return service.update_driver(driver_id, driver_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{driver_id}")
def delete_driver(
    driver_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = DriverService(db)

    try:
        return service.delete_driver(driver_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
