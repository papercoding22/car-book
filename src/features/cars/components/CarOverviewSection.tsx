import { Link } from 'react-router-dom'
import { CarImage } from '../../../components/common/CarImage'
import { routes } from '../../../app/routes'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatOdo } from '../../../utils/formatOdo'
import type { Car } from '../car.types'

type CarOverviewSectionProps = {
  car: Car
  totalExpense: number
  monthExpense: number
  activePartCount: number
}

export function CarOverviewSection({
  car,
  totalExpense,
  monthExpense,
  activePartCount,
}: CarOverviewSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="relative h-52">
        <CarImage
          key={`${car.id}-${car.image ?? 'no-image'}`}
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover"
          fallbackText="Chưa có ảnh xe"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-sm text-slate-300">{car.licensePlate}</p>
        <h2 className="text-3xl font-semibold text-slate-200">
          {car.brand} {car.model}
        </h2>
        <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          <p>ODO hiện tại: {formatOdo(car.currentOdo)}</p>
          <p>Mã lực: {car.horsepower ? `${car.horsepower} hp` : '-'}</p>
          <p>Tổng chi phí: {formatCurrency(totalExpense)}</p>
          <p>Chi phí tháng này: {formatCurrency(monthExpense)}</p>
          <p>Phụ tùng active: {activePartCount}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to={routes.expenses(car.id)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-blue-700"
          >
            Thêm chi phí
          </Link>
          <Link to={routes.parts(car.id)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm">
            Thêm phụ tùng
          </Link>
          <Link to={routes.editCar(car.id)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm">
            Chỉnh sửa xe
          </Link>
        </div>
      </div>
    </section>
  )
}
