import { Link } from 'react-router-dom'
import { routes } from '../../../app/routes'
import { EmptyState } from '../../../components/common/EmptyState'
import { CarImage } from '../../../components/common/CarImage'
import { carRepository } from '../car.repository'
import { getAppData } from '../../../services/storage/appData'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatOdo } from '../../../utils/formatOdo'

export function CarsPage() {
  const data = getAppData()
  const cars = carRepository.list()

  const onDelete = (carId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa xe này? Dữ liệu chi phí và phụ tùng sẽ bị xóa.')) {
      return
    }

    carRepository.remove(carId)
    window.location.reload()
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        title="Danh sách xe đang trống"
        description="Hãy thêm xe đầu tiên để bắt đầu sử dụng Garage Log."
        action={
          <Link
            to={routes.newCar}
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Thêm xe
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Danh sách xe</h2>
        <Link
          to={routes.newCar}
          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Thêm xe mới
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => {
          const carExpenses = data.expenses.filter((expense) => expense.carId === car.id)
          const totalCost = carExpenses.reduce((sum, expense) => sum + expense.cost, 0)

          return (
            <article key={car.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <CarImage
                key={`${car.id}-${car.image ?? 'no-image'}`}
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
              <p className="text-sm text-slate-300">{car.manufactureYear}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {car.brand} {car.model}
              </h3>
              <p className="mt-3 text-sm text-slate-300">Biển số: {car.licensePlate}</p>
              <p className="text-sm text-slate-300">ODO: {formatOdo(car.currentOdo)}</p>
              <p className="text-sm text-slate-300">Tổng chi phí: {formatCurrency(totalCost)}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={routes.carDetail(car.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
                >
                  Chi tiết
                </Link>
                <Link
                  to={routes.editCar(car.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
                >
                  Chỉnh sửa
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(car.id)}
                  className="rounded-lg border border-red-500/70 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/15"
                >
                  Xóa
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
