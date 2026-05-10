import { Navigate, useParams } from 'react-router-dom'
import { routes } from '../../../app/routes'
import { getAppData } from '../../../services/storage/appData'
import { carRepository } from '../car.repository'
import { CarOverviewSection } from '../components/CarOverviewSection'
import { RecentExpensesSection } from '../components/RecentExpensesSection'
import { InstalledPartsSection } from '../components/InstalledPartsSection'

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
        <RecentExpensesSection carId={car.id} expenses={expenses} />
        <InstalledPartsSection parts={parts} />
      </section>
    </div>
  )
}
