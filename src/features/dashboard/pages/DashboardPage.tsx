import { Link } from 'react-router-dom'
import { EmptyState } from '../../../components/common/EmptyState'
import { CarImage } from '../../../components/common/CarImage'
import { routes } from '../../../app/routes'
import { getAppData } from '../../../services/storage/appData'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'

export function DashboardPage() {
  const data = getAppData()
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.cost, 0)

  const monthKey = new Date().toISOString().slice(0, 7)
  const monthExpenses = data.expenses
    .filter((expense) => expense.date.startsWith(monthKey))
    .reduce((sum, expense) => sum + expense.cost, 0)

  const recentExpense = [...data.expenses].sort((a, b) => b.date.localeCompare(a.date))[0]
  const recentCar = recentExpense
    ? data.cars.find((car) => car.id === recentExpense.carId)
    : undefined

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Tổng số xe</p>
          <p className="mt-2 text-3xl font-semibold text-slate-200">{data.cars.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Tổng chi phí</p>
          <p className="mt-2 text-3xl font-semibold text-slate-200">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Chi phí tháng này</p>
          <p className="mt-2 text-3xl font-semibold text-slate-200">
            {formatCurrency(monthExpenses)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Hoạt động gần nhất</p>
          <p className="mt-2 font-semibold text-slate-200">
            {recentCar ? `${recentCar.brand} ${recentCar.model}` : '-'}
          </p>
          <p className="text-sm text-slate-300">
            {recentExpense ? formatDate(recentExpense.date) : 'Chưa có'}
          </p>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          to={routes.newCar}
          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-slate-200 transition hover:bg-blue-700"
        >
          Thêm xe
        </Link>
        {recentCar ? (
          <Link
            to={routes.expenses(recentCar.id)}
            className="rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:bg-slate-800"
          >
            Thêm chi phí
          </Link>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-200">Garage của bạn</h2>
        {data.cars.length === 0 ? (
          <EmptyState
            title="Chưa có xe nào trong garage"
            description="Thêm chiếc xe đầu tiên để bắt đầu tracking chi phí và phụ tùng."
            action={
              <Link
                to={routes.newCar}
                className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-slate-200 transition hover:bg-blue-700"
              >
                Thêm xe ngay
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.cars.map((car) => {
              const carTotal = data.expenses
                .filter((expense) => expense.carId === car.id)
                .reduce((sum, expense) => sum + expense.cost, 0)

              return (
                <article
                  key={car.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <CarImage
                    key={`${car.id}-${car.image ?? 'no-image'}`}
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="mb-3 h-36 w-full rounded-xl object-cover"
                  />
                  <p className="text-sm text-slate-400">{car.licensePlate}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-200">
                    {car.brand} {car.model}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">
                    ODO: {car.currentOdo.toLocaleString('en-US')} km
                  </p>
                  <p className="text-sm text-slate-300">Tổng chi phí: {formatCurrency(carTotal)}</p>
                  <Link
                    to={routes.carDetail(car.id)}
                    className="mt-4 inline-flex rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800"
                  >
                    Xem chi tiết
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
