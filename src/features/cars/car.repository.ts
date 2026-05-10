import { getAppData, saveAppData } from '../../services/storage/appData'
import { generateId } from '../../utils/id'
import type { Car, CarInput } from './car.types'

export const carRepository = {
  list(): Car[] {
    return getAppData().cars.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  getById(carId: string): Car | undefined {
    return getAppData().cars.find((car) => car.id === carId)
  },

  create(input: CarInput): Car {
    const data = getAppData()
    const now = new Date().toISOString()
    const created: Car = {
      id: generateId('car'),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    saveAppData({ ...data, cars: [created, ...data.cars] })
    return created
  },

  update(carId: string, input: CarInput): Car {
    const data = getAppData()
    const existing = data.cars.find((car) => car.id === carId)
    if (!existing) {
      throw new Error('Không tìm thấy xe')
    }

    const updated: Car = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }
    saveAppData({
      ...data,
      cars: data.cars.map((car) => (car.id === carId ? updated : car)),
      installedParts: data.installedParts.map((part) =>
        part.carId === carId ? { ...part, currentOdoSnapshot: updated.currentOdo } : part,
      ),
    })
    return updated
  },

  remove(carId: string): void {
    const data = getAppData()
    saveAppData({
      ...data,
      cars: data.cars.filter((car) => car.id !== carId),
      expenses: data.expenses.filter((expense) => expense.carId !== carId),
      installedParts: data.installedParts.filter((part) => part.carId !== carId),
    })
  },
}
