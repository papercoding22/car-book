export type Car = {
  id: string
  brand: string
  model: string
  manufactureYear: number
  licensePlate: string
  currentOdo: number
  image?: string
  horsepower?: number
  note?: string
  createdAt: string
  updatedAt: string
}

export type CarInput = Omit<Car, 'id' | 'createdAt' | 'updatedAt'>
