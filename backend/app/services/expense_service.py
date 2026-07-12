from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.vehicle import Vehicle
from app.schemas.expense import ExpenseCreate


class ExpenseService:

    def __init__(self, db: Session):
        self.db = db

    def create_expense(
        self,
        expense_data: ExpenseCreate,
    ):

        vehicle = self.db.get(
            Vehicle,
            expense_data.vehicle_id,
        )

        if not vehicle:
            raise ValueError("Vehicle not found.")

        expense = Expense(
            **expense_data.model_dump(),
        )

        self.db.add(expense)

        self.db.commit()

        self.db.refresh(expense)

        return expense

    def get_all_expenses(self):

        expenses = self.db.scalars(
            select(Expense)
        ).all()

        result = []

        for expense in expenses:

            vehicle = self.db.get(
                Vehicle,
                expense.vehicle_id,
            )

            result.append(
                {
                    "id": expense.id,
                    "vehicle_id": expense.vehicle_id,
                    "vehicle_name": vehicle.name if vehicle else "N/A",
                    "expense_type": expense.expense_type,
                    "amount": expense.amount,
                    "date": expense.date,
                }
            )

        return result