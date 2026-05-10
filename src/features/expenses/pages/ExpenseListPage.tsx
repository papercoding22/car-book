import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { routes } from '../../../app/routes'
import { carRepository } from '../../cars/car.repository'
import { expenseCategories } from '../expenseCategories'
import { expenseRepository } from '../expense.repository'
import type { ExpenseCategoryGroup } from '../expense.types'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { formatOdo } from '../../../utils/formatOdo'

export function ExpenseListPage() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  if (!carId) {
    return <Navigate to={routes.cars} replace />
  }

  const car = carRepository.getById(carId)
  if (!car) {
    return <Navigate to={routes.cars} replace />
  }

  const currentFilter = (searchParams.get('group') ?? '') as ExpenseCategoryGroup | ''
  const monthFilter = searchParams.get('month') ?? ''
  const query = (searchParams.get('q') ?? '').toLowerCase()

  const items = expenseRepository
    .listByCar(carId)
    .filter((expense) => (currentFilter ? expense.categoryGroup === currentFilter : true))
    .filter((expense) => (monthFilter ? expense.date.startsWith(monthFilter) : true))
    .filter((expense) =>
      query ? `${expense.category} ${expense.note ?? ''}`.toLowerCase().includes(query) : true,
    )

  const total = items.reduce((sum, expense) => sum + expense.cost, 0)

  const onDelete = (expenseId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa chi phí này?')) {
      return
    }

    expenseRepository.remove(expenseId)
    window.location.reload()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-slate-200">
          Toàn bộ chi phí - {car.brand} {car.model}
        </h2>
        <div className="flex gap-2">
          <Link to={routes.carDetail(carId)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm">
            Về chi tiết xe
          </Link>
          <Link
            to={routes.expenses(carId)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-blue-700"
          >
            Thêm chi phí
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 grid gap-3 md:grid-cols-4">
          <select
            className="input"
            value={currentFilter}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) {
                next.set('group', event.target.value)
              } else {
                next.delete('group')
              }
              setSearchParams(next)
            }}
          >
            <option value="">Tất cả nhóm</option>
            {Object.entries(expenseCategories).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            type="month"
            className="input"
            value={monthFilter}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) {
                next.set('month', event.target.value)
              } else {
                next.delete('month')
              }
              setSearchParams(next)
            }}
          />
          <input
            placeholder="Tìm theo hạng mục / ghi chú"
            className="input md:col-span-2"
            value={query}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) {
                next.set('q', event.target.value)
              } else {
                next.delete('q')
              }
              setSearchParams(next)
            }}
          />
        </div>

        <p className="mb-2 text-sm text-slate-300">Tổng chi phí theo bộ lọc: {formatCurrency(total)}</p>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="min-w-[110px] py-2 pr-4">Ngày</th>
                <th className="min-w-[170px] py-2 pr-4">Hạng mục</th>
                <th className="min-w-[140px] py-2 pr-4">Chi phí</th>
                <th className="min-w-[130px] py-2 pr-4">ODO</th>
                <th className="min-w-[220px] py-2 pr-4">Ghi chú</th>
                <th className="min-w-[120px] py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-900">
                  <td className="py-2 pr-4 text-slate-200 whitespace-nowrap">{formatDate(expense.date)}</td>
                  <td className="py-2 pr-4 text-slate-200">{expense.category}</td>
                  <td className="py-2 pr-4 text-slate-200 whitespace-nowrap">{formatCurrency(expense.cost)}</td>
                  <td className="py-2 pr-4 text-slate-200 whitespace-nowrap">
                    {expense.odoAtExpense ? formatOdo(expense.odoAtExpense) : '-'}
                  </td>
                  <td className="py-2 pr-4 text-slate-200">{expense.note || '-'}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-700 px-2 py-1 text-xs"
                        onClick={() =>
                          navigate(routes.expenses(carId), {
                            state: { editExpenseId: expense.id },
                          })
                        }
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="rounded border border-red-500/70 px-2 py-1 text-xs text-red-400 hover:bg-red-500/15"
                        onClick={() => onDelete(expense.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
