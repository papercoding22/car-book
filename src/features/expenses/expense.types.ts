export type ExpenseCategoryGroup =
  | 'maintenance'
  | 'mods'
  | 'cosmetic'
  | 'emergency'
  | 'running_cost'

export type Expense = {
  id: string
  carId: string
  date: string
  categoryGroup: ExpenseCategoryGroup
  category: string
  cost: number
  odoAtExpense?: number
  note?: string
  createdAt: string
  updatedAt: string
}

export type ExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
