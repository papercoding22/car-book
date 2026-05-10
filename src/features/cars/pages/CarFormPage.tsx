import { z } from 'zod'
import { useMemo, useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { carRepository } from '../car.repository'
import { routes } from '../../../app/routes'
import type { CarInput } from '../car.types'
import { FormattedNumberInput } from '../../../components/common/FormattedNumberInput'

const currentYear = new Date().getFullYear()

const schema = z.object({
  brand: z.string().min(1, 'Cần nhập hãng xe'),
  model: z.string().min(1, 'Cần nhập model'),
  manufactureYear: z.coerce
    .number()
    .int()
    .min(1950)
    .max(currentYear + 1),
  licensePlate: z.string().min(1, 'Cần nhập biển số'),
  currentOdo: z.coerce.number().min(0, 'ODO không được âm'),
  image: z.string().optional(),
  horsepower: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  note: z.string().optional(),
})

type CarFormPageProps = {
  mode: 'create' | 'edit'
}

const popularBrands = [
  'Toyota',
  'Honda',
  'Hyundai',
  'Kia',
  'Mazda',
  'Ford',
  'Mitsubishi',
  'Nissan',
  'Suzuki',
  'Subaru',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Lexus',
  'Volvo',
  'Porsche',
  'Land Rover',
  'Peugeot',
  'MG',
  'VinFast',
  'Yamaha',
  'Kawasaki',
  'Ducati',
  'KTM',
  'Triumph',
  'Harley-Davidson',
  'Royal Enfield',
  'Benelli',
  'Aprilia',
  'Piaggio',
]

export function CarFormPage({ mode }: CarFormPageProps) {
  const params = useParams()
  const navigate = useNavigate()
  const current = params.carId ? carRepository.getById(params.carId) : undefined
  const existingBrands = carRepository
    .list()
    .map((car) => car.brand.trim())
    .filter(Boolean)
  const brandOptions = [...new Set([...popularBrands, ...existingBrands])].sort((a, b) =>
    a.localeCompare(b),
  )
  const selectOptions = useMemo(
    () => brandOptions.map((brand) => ({ value: brand, label: brand })),
    [brandOptions],
  )
  const [brandValue, setBrandValue] = useState(current?.brand ?? '')

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
    if (!parsed.success) {
      window.alert(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ')
      return
    }

    const payload: CarInput = {
      brand: parsed.data.brand,
      model: parsed.data.model,
      manufactureYear: parsed.data.manufactureYear,
      licensePlate: parsed.data.licensePlate,
      currentOdo: parsed.data.currentOdo,
      image: parsed.data.image || undefined,
      horsepower: parsed.data.horsepower,
      note: parsed.data.note || undefined,
    }

    if (mode === 'create') {
      const created = carRepository.create(payload)
      navigate(routes.carDetail(created.id))
      return
    }

    if (!params.carId) {
      return
    }

    carRepository.update(params.carId, payload)
    navigate(routes.carDetail(params.carId))
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-slate-200">
        {mode === 'create' ? 'Thêm xe mới' : 'Chỉnh sửa thông tin xe'}
      </h2>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Hãng xe</span>
          <CreatableSelect
            options={selectOptions}
            value={brandValue ? { value: brandValue, label: brandValue } : null}
            onChange={(option) => setBrandValue(option?.value ?? '')}
            onCreateOption={(inputValue) => setBrandValue(inputValue.trim())}
            placeholder="Tìm hoặc nhập hãng mới"
            classNamePrefix="brand-select"
            noOptionsMessage={() => 'Không tìm thấy hãng'}
            formatCreateLabel={(value) => `Tạo hãng mới: ${value}`}
          />
          <input type="hidden" name="brand" value={brandValue} />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Model</span>
          <input name="model" defaultValue={current?.model} className="input" required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Năm sản xuất</span>
          <input
            name="manufactureYear"
            type="number"
            defaultValue={current?.manufactureYear}
            className="input"
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Biển số</span>
          <input
            name="licensePlate"
            defaultValue={current?.licensePlate}
            className="input"
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">ODO hiện tại</span>
          <FormattedNumberInput
            name="currentOdo"
            defaultValue={current?.currentOdo}
            className="input"
            required
            min={0}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Mã lực (HP)</span>
          <FormattedNumberInput
            name="horsepower"
            defaultValue={current?.horsepower}
            className="input"
            min={0}
          />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm text-slate-300">Ảnh xe (URL)</span>
          <input
            name="image"
            defaultValue={current?.image}
            className="input"
            placeholder="https://..."
          />
        </label>
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm text-slate-300">Ghi chú</span>
          <textarea name="note" defaultValue={current?.note} rows={4} className="input" />
        </label>
        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-slate-200 hover:bg-blue-700"
          >
            {mode === 'create' ? 'Lưu xe' : 'Cập nhật'}
          </button>
          <Link
            to={routes.cars}
            className="rounded-xl border border-slate-700 px-4 py-2 text-slate-100"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}
