from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.schemas.trip import (
    TripCreate,
    TripComplete,
    TripListResponse,
    TripResponse,
)
from app.services.trip_service import TripService
from app.utils.enums import TripStatus

router = APIRouter(
    prefix="/trips",
    tags=["Trips"],
)


@router.post("", response_model=TripResponse)
def create_trip(
    trip_data: TripCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = TripService(db)

    try:
        return service.create_trip(trip_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[TripListResponse])
def get_all_trips(
    search: str | None = Query(default=None),
    status: TripStatus | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = TripService(db)

    return service.get_all_trips(
        search=search,
        status=status,
    )


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = TripService(db)

    try:
        return service.get_trip_by_id(trip_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch_trip(
    trip_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = TripService(db)

    try:
        return service.dispatch_trip(trip_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{trip_id}/complete", response_model=TripResponse)
def complete_trip(
    trip_id: UUID,
    data: TripComplete,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = TripService(db)

    try:
        return service.complete_trip(trip_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{trip_id}/cancel", response_model=TripResponse)
def cancel_trip(
    trip_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = TripService(db)

    try:
        return service.cancel_trip(trip_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))