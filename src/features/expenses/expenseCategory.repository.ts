import { getAppData, saveAppData } from '../../services/storage/appData'
import { expenseCategories } from './expenseCategories'
import type { ExpenseCategoryGroup } from './expense.types'

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

export const expenseCategoryRepository = {
  listByGroup(group: ExpenseCategoryGroup): string[] {
    const data = getAppData()
    const base = expenseCategories[group].items
    const custom = data.customExpenseCategories[group] ?? []
    return unique([...base, ...custom])
  },

  add(group: ExpenseCategoryGroup, categoryName: string): string {
    const value = categoryName.trim()
    if (!value) {
      throw new Error('Tên category không được để trống')
    }

    const data = getAppData()
    const base = expenseCategories[group].items
    const custom = data.customExpenseCategories[group] ?? []
    const existing = unique([...base, ...custom])
    if (existing.some((item) => item.toLowerCase() === value.toLowerCase())) {
      throw new Error('Category đã tồn tại trong nhóm này')
    }

    const currentCustom = data.customExpenseCategories[group] ?? []
    const nextCustom = {
      ...data.customExpenseCategories,
      [group]: [...currentCustom, value],
    }

    saveAppData({ ...data, customExpenseCategories: nextCustom })
    return value
  },
}
