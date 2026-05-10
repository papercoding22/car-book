import { z } from 'zod'
import { useState } from 'react'
import type { FormEventHandler } from 'react'
import Select from 'react-select'
import { createPortal } from 'react-dom'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
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

const expenseGroupOptions = Object.entries(expenseCategories).map(([key, category]) => ({
  value: key as ExpenseCategoryGroup,
  label: category.label,
}))

export function ExpenseTimelinePage() {
  const { carId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialEditExpenseId =
    ((location.state as { editExpenseId?: string } | null)?.editExpenseId as string | undefined) ?? null
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(initialEditExpenseId)

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

  const allExpenses = expenseRepository.listByCar(carId)

  const items = allExpenses
    .filter((expense) => (currentFilter ? expense.categoryGroup === currentFilter : true))
    .filter((expense) => (monthFilter ? expense.date.startsWith(monthFilter) : true))
    .filter((expense) =>
      query ? `${expense.category} ${expense.note ?? ''}`.toLowerCase().includes(query) : true,
    )

  const editingItem = editingExpenseId
    ? allExpenses.find((expense) => expense.id === editingExpenseId)
    : undefined

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
          onSaved={() => navigate(routes.expenses(carId), { replace: true })}
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 grid gap-3 md:grid-cols-4">
          <Select
            classNamePrefix="brand-select"
            options={[{ value: '', label: 'Tất cả nhóm' }, ...expenseGroupOptions]}
            value={
              [{ value: '', label: 'Tất cả nhóm' }, ...expenseGroupOptions].find(
                (option) => option.value === currentFilter,
              ) ?? null
            }
            onChange={(option) => {
              const next = new URLSearchParams(searchParams)
              if (option?.value) {
                next.set('group', option.value)
              } else {
                next.delete('group')
              }
              setSearchParams(next)
            }}
            isSearchable={false}
            placeholder="Lọc nhóm"
          />
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
        <div className="overflow-x-auto">
          <table className="min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="min-w-[110px] py-2 pr-4">Ngày</th>
                <th className="min-w-[170px] py-2 pr-4">Hạng mục</th>
                <th className="min-w-[140px] py-2 pr-4">Chi phí</th>
                <th className="min-w-[130px] py-2 pr-4">ODO</th>
                <th className="min-w-[180px] py-2 pr-4">Ghi chú</th>
                <th className="min-w-[120px] py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-900">
                  <td className="py-2 pr-4 text-slate-200 whitespace-nowrap">
                    {formatDate(expense.date)}
                  </td>
                  <td className="py-2 pr-4 text-slate-200">{expense.category}</td>
                  <td className="py-2 pr-4 text-slate-200 whitespace-nowrap">
                    {formatCurrency(expense.cost)}
                  </td>
                  <td className="py-2 pr-4 text-slate-200 whitespace-nowrap">
                    {expense.odoAtExpense ? formatOdo(expense.odoAtExpense) : '-'}
                  </td>
                  <td className="py-2 pr-4 text-slate-200">{expense.note || '-'}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded border border-slate-700 px-2 py-1 text-xs"
                        onClick={() => setEditingExpenseId(expense.id)}
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

      {editingItem
        ? createPortal(
            <div className="fixed inset-0 z-[100] p-4">
              <div
                className="absolute inset-0 bg-slate-950/70"
                onClick={() => setEditingExpenseId(null)}
                aria-hidden="true"
              />

              <div className="relative flex h-full items-center justify-center">
                <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">Chỉnh sửa chi phí</h3>
                    <button
                      type="button"
                      onClick={() => setEditingExpenseId(null)}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      Đóng
                    </button>
                  </div>

                  <ExpenseFormSection
                    key={`edit-expense-${editingItem.id}`}
                    carId={carId}
                    editingItem={editingItem}
                    onSaved={() => setEditingExpenseId(null)}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
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
  const categoryOptions = categoryItems.map((item) => ({ value: item, label: item }))
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
      <label className="space-y-1">
        <span className="text-xs font-medium text-slate-300">Ngày chi phí</span>
        <AppDatePicker
          key={`date-${editingItem?.id ?? 'new'}`}
          name="date"
          defaultValue={editingItem?.date}
          className="input"
          required
          placeholder="Chọn ngày"
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-medium text-slate-300">Nhóm chi phí</span>
        <Select
          key={`group-${editingItem?.id ?? 'new'}`}
          name="categoryGroup"
          classNamePrefix="brand-select"
          options={expenseGroupOptions}
          value={expenseGroupOptions.find((option) => option.value === formGroup) ?? null}
          onChange={(option) => {
            const group = (option?.value ?? 'maintenance') as ExpenseCategoryGroup
            const firstCategory = expenseCategoryRepository.listByGroup(group)[0] ?? ''
            setFormGroup(group)
            setPreferredCategory(firstCategory)
            setCategoryVersion((value) => value + 1)
          }}
          isSearchable={false}
          placeholder="Chọn nhóm chi phí"
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-medium text-slate-300">Số tiền</span>
        <FormattedNumberInput
          key={`cost-${editingItem?.id ?? 'new'}`}
          name="cost"
          min={0}
          className="input"
          defaultValue={editingItem?.cost}
          placeholder="Chi phí"
          required
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-medium text-slate-300">Hạng mục chi phí</span>
        <Select
          key={`category-${formGroup}-${categoryVersion}-${editingItem?.id ?? 'new'}`}
          name="category"
          classNamePrefix="brand-select"
          options={categoryOptions}
          value={categoryOptions.find((option) => option.value === selectedCategory) ?? null}
          onChange={(option) => setPreferredCategory(option?.value ?? '')}
          isSearchable
          placeholder="Chọn hạng mục"
        />
      </label>
      <div className="space-y-1">
        <span className="text-xs font-medium text-slate-300">Tạo hạng mục mới</span>
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
      </div>
      <label className="space-y-1">
        <span className="text-xs font-medium text-slate-300">ODO tại thời điểm chi</span>
        <FormattedNumberInput
          key={`odo-${editingItem?.id ?? 'new'}`}
          name="odoAtExpense"
          min={0}
          className="input"
          defaultValue={editingItem?.odoAtExpense}
          placeholder="ODO tại thời điểm chi"
        />
      </label>
      <label className="space-y-1 md:col-span-3">
        <span className="text-xs font-medium text-slate-300">Ghi chú</span>
        <textarea
          name="note"
          className="input"
          rows={2}
          defaultValue={editingItem?.note}
          placeholder="Ghi chú"
        />
      </label>
      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-slate-200 hover:bg-blue-700 md:col-span-3"
      >
        {editingItem ? 'Cập nhật chi phí' : 'Thêm chi phí'}
      </button>
    </form>
  )
}
