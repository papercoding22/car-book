import { z } from 'zod'
import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { routes } from '../../../app/routes'
import { carRepository } from '../../cars/car.repository'
import { expenseCategories } from '../expenseCategories'
import { expenseCategoryRepository } from '../expenseCategory.repository'
import { expenseRepository } from '../expense.repository'
import type { Expense, ExpenseCategoryGroup, ExpenseInput } from '../expense.types'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { formatOdo } from '../../../utils/formatOdo'
import { FormattedNumberInput } from '../../../components/common/FormattedNumberInput'
import { AppDatePicker } from '../../../components/common/AppDatePicker'

const schema = z.object({
  date: z.string().min(1),
  categoryGroup: z.enum(['maintenance', 'mods', 'cosmetic', 'emergency', 'running_cost']),
  category: z.string().min(1),
  cost: z.coerce.number().min(0),
  odoAtExpense: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  note: z.string().optional(),
})

export function ExpenseTimelinePage() {
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

  const editingId = searchParams.get('edit')
  const editingItem = items.find((item) => item.id === editingId)

  const onDelete = (expenseId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa chi phí này?')) {
      return
    }
    expenseRepository.remove(expenseId)
    window.location.reload()
  }

  const total = items.reduce((sum, expense) => sum + expense.cost, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-200">
          Timeline chi phí - {car.brand} {car.model}
        </h2>
        <Link
          to={routes.carDetail(carId)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm"
        >
          Về chi tiết xe
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <ExpenseFormSection
          carId={carId}
          editingItem={editingItem}
          onSaved={() => navigate(routes.expenses(carId), { replace: true })}
        />
      </section>

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
            placeholder="Search note/category"
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

        <p className="mb-2 text-sm text-slate-300">
          Tổng chi phí theo bộ lọc: {formatCurrency(total)}
        </p>
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2">Date</th>
                <th className="py-2">Category</th>
                <th className="py-2">Cost</th>
                <th className="py-2">ODO</th>
                <th className="py-2">Note</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-900">
                  <td className="py-2 text-slate-200">{formatDate(expense.date)}</td>
                  <td className="py-2 text-slate-200">{expense.category}</td>
                  <td className="py-2 text-slate-200">{formatCurrency(expense.cost)}</td>
                  <td className="py-2 text-slate-200">
                    {expense.odoAtExpense ? formatOdo(expense.odoAtExpense) : '-'}
                  </td>
                  <td className="py-2 text-slate-200">{expense.note || '-'}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-700 px-2 py-1 text-xs"
                        onClick={() => {
                          const next = new URLSearchParams(searchParams)
                          next.set('edit', expense.id)
                          setSearchParams(next)
                        }}
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

type ExpenseFormSectionProps = {
  carId: string
  editingItem?: Expense
  onSaved: () => void
}

function ExpenseFormSection({ carId, editingItem, onSaved }: ExpenseFormSectionProps) {
  const [formGroup, setFormGroup] = useState<ExpenseCategoryGroup>(
    editingItem?.categoryGroup ?? 'maintenance',
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryVersion, setCategoryVersion] = useState(0)
  const [preferredCategory, setPreferredCategory] = useState(editingItem?.category ?? '')

  const categoryItems = expenseCategoryRepository.listByGroup(formGroup)
  const selectedCategory = categoryItems.includes(preferredCategory)
    ? preferredCategory
    : (categoryItems[0] ?? '')

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
    if (!parsed.success) {
      window.alert('Dữ liệu chi phí không hợp lệ')
      return
    }

    const payload: ExpenseInput = {
      carId,
      date: parsed.data.date,
      categoryGroup: parsed.data.categoryGroup,
      category: parsed.data.category,
      cost: parsed.data.cost,
      odoAtExpense: parsed.data.odoAtExpense,
      note: parsed.data.note || undefined,
    }

    if (editingItem) {
      expenseRepository.update(editingItem.id, payload)
    } else {
      expenseRepository.create(payload)
    }

    onSaved()
  }

  const onCreateCategory = () => {
    try {
      const created = expenseCategoryRepository.add(formGroup, newCategoryName)
      setPreferredCategory(created)
      setNewCategoryName('')
      setCategoryVersion((value) => value + 1)
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message)
        return
      }

      window.alert('Không thể tạo category mới')
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
      <AppDatePicker
        key={`date-${editingItem?.id ?? 'new'}`}
        name="date"
        defaultValue={editingItem?.date}
        className="input"
        required
        placeholder="Chọn ngày"
      />
      <select
        name="categoryGroup"
        value={formGroup}
        className="input"
        onChange={(event) => {
          const group = event.target.value as ExpenseCategoryGroup
          const firstCategory = expenseCategoryRepository.listByGroup(group)[0] ?? ''
          setFormGroup(group)
          setPreferredCategory(firstCategory)
          setCategoryVersion((value) => value + 1)
        }}
      >
        {Object.entries(expenseCategories).map(([key, category]) => (
          <option key={key} value={key}>
            {category.label}
          </option>
        ))}
      </select>
      <FormattedNumberInput
        key={`cost-${editingItem?.id ?? 'new'}`}
        name="cost"
        min={0}
        className="input"
        defaultValue={editingItem?.cost}
        placeholder="Chi phí"
        required
      />
      <select
        key={`category-${formGroup}-${categoryVersion}-${editingItem?.id ?? 'new'}`}
        name="category"
        defaultValue={selectedCategory}
        className="input"
      >
        {categoryItems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
          className="input"
          placeholder="Tạo category mới"
        />
        <button
          type="button"
          onClick={onCreateCategory}
          className="shrink-0 rounded-xl border border-slate-700 px-3 text-sm hover:bg-slate-800"
        >
          Thêm
        </button>
      </div>
      <FormattedNumberInput
        key={`odo-${editingItem?.id ?? 'new'}`}
        name="odoAtExpense"
        min={0}
        className="input"
        defaultValue={editingItem?.odoAtExpense}
        placeholder="ODO tại thời điểm chi"
      />
      <textarea
        name="note"
        className="input md:col-span-3"
        rows={2}
        defaultValue={editingItem?.note}
        placeholder="Ghi chú"
      />
      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 md:col-span-3"
      >
        {editingItem ? 'Cập nhật chi phí' : 'Thêm chi phí'}
      </button>
    </form>
  )
}
