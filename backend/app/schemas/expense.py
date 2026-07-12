from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import ExpenseType


class ExpenseCreate(BaseModel):
    vehicle_id: UUID
    expense_type: ExpenseType
    amount: float = Field(gt=0)
    date: date


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    vehicle_id: UUID
    expense_type: ExpenseType
    amount: float
    date: date


class ExpenseListResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    vehicle_name: str
    expense_type: ExpenseType
    amount: float
    date: date