import type { ExpenseCategoryGroup } from './expense.types'

type ExpenseCategoryConfig = {
  label: string
  items: string[]
}

export const expenseCategories: Record<ExpenseCategoryGroup, ExpenseCategoryConfig> = {
  maintenance: {
    label: 'Bảo dưỡng',
    items: [
      'Thay nhớt',
      'Lọc gió',
      'Brake pad',
      'Lốp',
      'Bugi',
      'Nước làm mát',
      'Dầu hộp số',
      'Ắc quy',
      'Vệ sinh kim phun',
      'Cân chỉnh thước lái',
    ],
  },
  mods: {
    label: 'Nâng cấp',
    items: [
      'Exhaust',
      'Body kit',
      'Suspension',
      'ECU',
      'Intake',
      'Wheels',
      'Brake upgrade',
      'Turbo/Supercharger',
      'Interior mod',
    ],
  },
  cosmetic: {
    label: 'Ngoại thất',
    items: ['Wrap', 'Detailing', 'Ceramic coating', 'PPF', 'Sơn dặm', 'Polish', 'Đèn', 'Tint film'],
  },
  emergency: {
    label: 'Khẩn cấp',
    items: ['Cứu hộ', 'Sửa va quẹt', 'Thủng lốp', 'Hỏng máy', 'Hỏng điện', 'Tai nạn', 'Khác'],
  },
  running_cost: {
    label: 'Vận hành',
    items: ['Xăng', 'Gửi xe', 'Phí đường bộ', 'Bảo hiểm', 'Đăng kiểm', 'Rửa xe', 'Vé cao tốc'],
  },
}
