export const routes = {
  dashboard: '/',
  cars: '/cars',
  newCar: '/cars/new',
  carDetail: (carId: string) => `/cars/${carId}`,
  editCar: (carId: string) => `/cars/${carId}/edit`,
  expenses: (carId: string) => `/cars/${carId}/expenses`,
  expenseList: (carId: string) => `/cars/${carId}/expenses/all`,
  parts: (carId: string) => `/cars/${carId}/parts`,
  settings: '/settings',
} as const
