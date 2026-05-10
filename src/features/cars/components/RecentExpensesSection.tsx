import { CalendarDays, ReceiptText } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import type { Expense } from '../../expenses/expense.types'

type RecentExpensesSectionProps = {
  expenses: Expense[]
}

export function RecentExpensesSection({ expenses }: RecentExpensesSectionProps) {
  const topFive = expenses.slice(0, 5)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
          <ReceiptText size={18} className="text-blue-600" />
          Chi phí gần đây
        </h3>
        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
          {topFive.length} mục
        </span>
      </div>

      <div className="space-y-3">
        {topFive.map((expense) => (
          <div
            key={expense.id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm transition hover:border-blue-600/40"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-slate-200">{expense.category}</p>
              <p className="rounded-lg bg-blue-600/20 px-2.5 py-1 text-xs font-semibold text-blue-200">
                {formatCurrency(expense.cost)}
              </p>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-slate-300">
              <CalendarDays size={14} className="text-cyan-400" />
              {formatDate(expense.date)}
            </p>
            {expense.note ? <p className="mt-1 text-xs text-slate-400">{expense.note}</p> : null}
          </div>
        ))}
        {expenses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-4 text-center text-sm text-slate-300">
            Chưa có chi phí nào.
          </div>
        ) : null}
      </div>
    </div>
  )
}
