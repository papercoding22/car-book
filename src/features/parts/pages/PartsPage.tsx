import { z } from 'zod'
import type { FormEventHandler } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { routes } from '../../../app/routes'
import { carRepository } from '../../cars/car.repository'
import { partRepository } from '../part.repository'
import type { PartInput, PartStatus } from '../part.types'
import { formatDate } from '../../../utils/formatDate'
import { formatOdo } from '../../../utils/formatOdo'
import { FormattedNumberInput } from '../../../components/common/FormattedNumberInput'
import { AppDatePicker } from '../../../components/common/AppDatePicker'

const schema = z.object({
  partName: z.string().min(1),
  brand: z.string().optional(),
  installedAtOdo: z.coerce.number().min(0),
  currentOdoSnapshot: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  installedDate: z.string().optional(),
  status: z.enum(['active', 'replaced', 'removed', 'needs_check']),
  note: z.string().optional(),
})

const statusLabel: Record<PartStatus, string> = {
  active: 'Đang dùng',
  replaced: 'Đã thay',
  removed: 'Đã tháo',
  needs_check: 'Cần kiểm tra',
}

const statusBadgeClass: Record<PartStatus, string> = {
  active: 'border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]',
  replaced: 'border-[#06B6D4]/40 bg-[#06B6D4]/15 text-[#06B6D4]',
  removed: 'border-slate-500/50 bg-slate-500/15 text-slate-200',
  needs_check: 'border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#F59E0B]',
}

export function PartsPage() {
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

  const statusFilter = (searchParams.get('status') ?? '') as PartStatus | ''
  const editingId = searchParams.get('edit')

  const items = partRepository
    .listByCar(carId)
    .filter((part) => (statusFilter ? part.status === statusFilter : true))

  const editingItem = items.find((item) => item.id === editingId)

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

    if (!parsed.success) {
      window.alert('Dữ liệu phụ tùng không hợp lệ')
      return
    }

    const payload: PartInput = {
      carId,
      partName: parsed.data.partName,
      brand: parsed.data.brand || undefined,
      installedAtOdo: parsed.data.installedAtOdo,
      currentOdoSnapshot: parsed.data.currentOdoSnapshot,
      installedDate: parsed.data.installedDate || undefined,
      status: parsed.data.status,
      note: parsed.data.note || undefined,
    }

    if (editingItem) {
      partRepository.update(editingItem.id, payload)
    } else {
      partRepository.create(payload)
    }

    navigate(routes.parts(carId), { replace: true })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Phụ tùng đang lắp - {car.brand} {car.model}
        </h2>
        <Link
          to={routes.carDetail(carId)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm"
        >
          Về chi tiết xe
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <input
            name="partName"
            className="input"
            placeholder="Tên phụ tùng"
            defaultValue={editingItem?.partName}
            required
          />
          <input
            name="brand"
            className="input"
            placeholder="Thương hiệu"
            defaultValue={editingItem?.brand}
          />
          <FormattedNumberInput
            key={`installed-${editingItem?.id ?? 'new'}`}
            name="installedAtOdo"
            min={0}
            className="input"
            placeholder="Lắp tại ODO"
            defaultValue={editingItem?.installedAtOdo}
            required
          />
          <FormattedNumberInput
            key={`snapshot-${editingItem?.id ?? 'new'}`}
            name="currentOdoSnapshot"
            min={0}
            className="input"
            placeholder="ODO xe hiện tại"
            defaultValue={editingItem?.currentOdoSnapshot}
          />
          <AppDatePicker
            key={`installed-date-${editingItem?.id ?? 'new'}`}
            name="installedDate"
            className="input"
            defaultValue={editingItem?.installedDate}
            placeholder="Ngày lắp"
          />
          <select name="status" className="input" defaultValue={editingItem?.status ?? 'active'}>
            {(Object.keys(statusLabel) as PartStatus[]).map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
          <textarea
            name="note"
            className="input md:col-span-3"
            rows={2}
            placeholder="Ghi chú"
            defaultValue={editingItem?.note}
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 md:col-span-3"
          >
            {editingItem ? 'Cập nhật phụ tùng' : 'Thêm phụ tùng'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <select
            className="input max-w-xs"
            value={statusFilter}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) {
                next.set('status', event.target.value)
              } else {
                next.delete('status')
              }
              setSearchParams(next)
            }}
          >
            <option value="">Tất cả status</option>
            {(Object.keys(statusLabel) as PartStatus[]).map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2">Part</th>
                <th className="py-2">Brand</th>
                <th className="py-2">Installed At</th>
                <th className="py-2">Current ODO</th>
                <th className="py-2">Km used</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((part) => {
                const kmUsed = car.currentOdo - part.installedAtOdo

                return (
                  <tr key={part.id} className="border-b border-slate-900">
                    <td className="py-2 text-slate-200">{part.partName}</td>
                    <td className="py-2 text-slate-200">{part.brand || '-'}</td>
                    <td className="py-2 text-slate-200">{formatOdo(part.installedAtOdo)}</td>
                    <td className="py-2 text-slate-200">
                      {formatOdo(part.currentOdoSnapshot ?? car.currentOdo)}
                    </td>
                    <td className="py-2 text-slate-200">{formatOdo(kmUsed > 0 ? kmUsed : 0)}</td>
                    <td className="py-2 text-slate-200">
                      {part.installedDate ? formatDate(part.installedDate) : '-'}
                    </td>
                    <td className="py-2 text-slate-200">
                      <span
                        className={[
                          'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                          statusBadgeClass[part.status],
                        ].join(' ')}
                      >
                        {statusLabel[part.status]}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded border border-slate-700 px-2 py-1 text-xs"
                          onClick={() => {
                            const next = new URLSearchParams(searchParams)
                            next.set('edit', part.id)
                            setSearchParams(next)
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-500/70 px-2 py-1 text-xs text-red-400 hover:bg-red-500/15"
                          onClick={() => {
                            if (!window.confirm('Bạn chắc chắn muốn xóa phụ tùng này?')) {
                              return
                            }
                            partRepository.remove(part.id)
                            window.location.reload()
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
