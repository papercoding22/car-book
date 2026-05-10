import { Navigate, useParams } from 'react-router-dom'
import { routes } from '../../../app/routes'
import { getAppData } from '../../../services/storage/appData'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { carRepository } from '../car.repository'
import type { PartStatus } from '../../parts/part.types'
import { CarOverviewSection } from '../components/CarOverviewSection'

const partStatusLabel: Record<PartStatus, string> = {
  active: 'Đang dùng',
  replaced: 'Đã thay',
  removed: 'Đã tháo',
  needs_check: 'Cần kiểm tra',
}

const partStatusBadgeClass: Record<PartStatus, string> = {
  active: 'border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]',
  replaced: 'border-[#06B6D4]/40 bg-[#06B6D4]/15 text-[#06B6D4]',
  removed: 'border-slate-500/50 bg-slate-500/15 text-slate-200',
  needs_check: 'border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#F59E0B]',
}

export function CarDetailPage() {
  const { carId } = useParams()
  if (!carId) {
    return <Navigate to={routes.cars} replace />
  }

  const data = getAppData()
  const car = carRepository.getById(carId)
  if (!car) {
    return <Navigate to={routes.cars} replace />
  }

  const expenses = data.expenses.filter((expense) => expense.carId === carId)
  const parts = data.installedParts.filter((part) => part.carId === carId)
  const activeParts = parts.filter((part) => part.status === 'active')
  const total = expenses.reduce((sum, expense) => sum + expense.cost, 0)
  const monthKey = new Date().toISOString().slice(0, 7)
  const monthCost = expenses
    .filter((expense) => expense.date.startsWith(monthKey))
    .reduce((sum, expense) => sum + expense.cost, 0)

  return (
    <div className="space-y-6">
      <CarOverviewSection
        car={car}
        totalExpense={total}
        monthExpense={monthCost}
        activePartCount={activeParts.length}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-semibold text-slate-200">Chi phí gần đây</h3>
          <div className="mt-3 space-y-2">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm"
              >
                <p className="font-medium text-slate-200">{expense.category}</p>
                <p className="text-slate-300">{formatDate(expense.date)}</p>
                <p className="text-slate-200">{formatCurrency(expense.cost)}</p>
              </div>
            ))}
            {expenses.length === 0 ? (
              <p className="text-sm text-slate-400">Chưa có chi phí nào.</p>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-semibold text-slate-200">Phụ tùng đang lắp</h3>
          <div className="mt-3 space-y-2">
            {parts.slice(0, 5).map((part) => (
              <div
                key={part.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm"
              >
                <p className="font-medium text-slate-200">{part.partName}</p>
                <p className="text-slate-300">Thương hiệu: {part.brand || '-'}</p>
                <div className="mt-1">
                  <span
                    className={[
                      'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                      partStatusBadgeClass[part.status],
                    ].join(' ')}
                  >
                    {partStatusLabel[part.status]}
                  </span>
                </div>
              </div>
            ))}
            {parts.length === 0 ? (
              <p className="text-sm text-slate-400">Chưa có phụ tùng nào.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
