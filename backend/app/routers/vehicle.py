from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)
from app.services.vehicle_service import VehicleService

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


@router.post("", response_model=VehicleResponse)
def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)

    try:
        return service.create_vehicle(vehicle_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[VehicleResponse])
def get_all_vehicles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    return service.get_all_vehicles()

@router.get("/available", response_model=list[VehicleResponse])
def get_available_vehicles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)
    return service.get_available_vehicles()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)

    try:
        return service.get_vehicle_by_id(vehicle_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: UUID,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)

    try:
        return service.update_vehicle(vehicle_id, vehicle_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = VehicleService(db)

    try:
        return service.delete_vehicle(vehicle_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
