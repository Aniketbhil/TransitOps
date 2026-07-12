from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.vehicle import router as vehicle_router
from app.routers.driver import router as driver_router
from app.routers.trip import router as trip_router
from app.routers.maintenance import router as maintenance_router
from app.routers.fuel_log import router as fuel_log_router
from app.routers.expense import router as expense_router
from app.routers.dashboard import router as dashboard_router

app = FastAPI(
    title="TransitOps API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],  
)

app.include_router(auth_router)
app.include_router(vehicle_router)
app.include_router(driver_router)
app.include_router(trip_router)
app.include_router(maintenance_router)
app.include_router(fuel_log_router)
app.include_router(expense_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "TransitOps Backend Running"
    }