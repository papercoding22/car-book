import type { Car } from '../../features/cars/car.types'
import type { ExpenseCategoryGroup, Expense } from '../../features/expenses/expense.types'
import type { InstalledPart } from '../../features/parts/part.types'
import { LocalStorageAdapter } from './localStorageAdapter'

export const STORAGE_KEY = 'garage_log_data'
export const SCHEMA_VERSION = 1

export type AppData = {
  cars: Car[]
  expenses: Expense[]
  installedParts: InstalledPart[]
  customExpenseCategories: Partial<Record<ExpenseCategoryGroup, string[]>>
  schemaVersion: number
}

const adapter = new LocalStorageAdapter()

const now = new Date().toISOString()

const devSeed: AppData = {
  schemaVersion: SCHEMA_VERSION,
  cars: [
    {
      id: 'car_demo_gr86',
      image:
        'https://di-uploads-pod13.dealerinspire.com/andersontoyota/uploads/2023/02/2022-toyota-gr86-93-1629157639.jpg',
      brand: 'Toyota',
      model: 'GR86',
      manufactureYear: 2022,
      licensePlate: '51K-888.88',
      currentOdo: 58200,
      horsepower: 235,
      note: 'Xe demo phục vụ test app',
      createdAt: now,
      updatedAt: now,
    },
  ],
  expenses: [
    {
      id: 'exp_demo_1',
      carId: 'car_demo_gr86',
      date: '2025-05-12',
      categoryGroup: 'maintenance',
      category: 'Thay nhớt',
      cost: 1000000,
      odoAtExpense: 58200,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'exp_demo_2',
      carId: 'car_demo_gr86',
      date: '2025-05-18',
      categoryGroup: 'mods',
      category: 'Body kit',
      cost: 12000000,
      odoAtExpense: 58300,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'exp_demo_3',
      carId: 'car_demo_gr86',
      date: '2025-05-20',
      categoryGroup: 'cosmetic',
      category: 'Ceramic coating',
      cost: 5000000,
      odoAtExpense: 58400,
      createdAt: now,
      updatedAt: now,
    },
  ],
  installedParts: [
    {
      id: 'part_demo_1',
      carId: 'car_demo_gr86',
      partName: 'Tire',
      brand: 'Michelin PS5',
      installedAtOdo: 52000,
      status: 'active',
      installedDate: '2025-03-01',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'part_demo_2',
      carId: 'car_demo_gr86',
      partName: 'Brake Pad',
      brand: 'Endless MX72',
      installedAtOdo: 55000,
      status: 'active',
      installedDate: '2025-04-10',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'part_demo_3',
      carId: 'car_demo_gr86',
      partName: 'Coilover',
      brand: 'Tein Flex Z',
      installedAtOdo: 40000,
      status: 'active',
      installedDate: '2024-08-12',
      createdAt: now,
      updatedAt: now,
    },
  ],
  customExpenseCategories: {},
}

const emptyData: AppData = {
  cars: [],
  expenses: [],
  installedParts: [],
  customExpenseCategories: {},
  schemaVersion: SCHEMA_VERSION,
}

export function migrateDataIfNeeded(data: AppData): AppData {
  const customExpenseCategories = data.customExpenseCategories ?? {}

  if (!data.schemaVersion || data.schemaVersion < SCHEMA_VERSION) {
    return { ...data, customExpenseCategories, schemaVersion: SCHEMA_VERSION }
  }

  return { ...data, customExpenseCategories }
}

export function getAppData(): AppData {
  const existing = adapter.get<AppData>(STORAGE_KEY)
  if (existing) {
    return migrateDataIfNeeded(existing)
  }

  if (import.meta.env.DEV) {
    saveAppData(devSeed)
    return devSeed
  }

  return emptyData
}

export function saveAppData(data: AppData): void {
  adapter.set(STORAGE_KEY, { ...data, schemaVersion: SCHEMA_VERSION })
}

export function resetAppData(): void {
  adapter.remove(STORAGE_KEY)
}

export function exportData(): string {
  return JSON.stringify(getAppData(), null, 2)
}

export function importData(rawText: string): void {
  const parsed = JSON.parse(rawText) as AppData
  const migrated = migrateDataIfNeeded(parsed)
  saveAppData(migrated)
}
