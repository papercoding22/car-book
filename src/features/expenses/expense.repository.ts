import { getAppData, saveAppData } from '../../services/storage/appData'
import { generateId } from '../../utils/id'
import type { Expense, ExpenseInput } from './expense.types'

export const expenseRepository = {
  listByCar(carId: string): Expense[] {
    return getAppData()
      .expenses.filter((expense) => expense.carId === carId)
      .sort((a, b) => b.date.localeCompare(a.date))
  },

  create(input: ExpenseInput): Expense {
    const data = getAppData()
    const now = new Date().toISOString()
    const created: Expense = {
      id: generateId('expense'),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    saveAppData({ ...data, expenses: [created, ...data.expenses] })
    return created
  },

  update(expenseId: string, input: ExpenseInput): Expense {
    const data = getAppData()
    const existing = data.expenses.find((expense) => expense.id === expenseId)
    if (!existing) {
      throw new Error('Không tìm thấy chi phí')
    }

    const updated: Expense = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }
    saveAppData({
      ...data,
      expenses: data.expenses.map((expense) => (expense.id === expenseId ? updated : expense)),
    })
    return updated
  },

  remove(expenseId: string): void {
    const data = getAppData()
    saveAppData({ ...data, expenses: data.expenses.filter((expense) => expense.id !== expenseId) })
  },
}
