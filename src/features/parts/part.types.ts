export type PartStatus = 'active' | 'replaced' | 'removed' | 'needs_check'

export type InstalledPart = {
  id: string
  carId: string
  partName: string
  brand?: string
  installedAtOdo: number
  currentOdoSnapshot?: number
  installedDate?: string
  status: PartStatus
  note?: string
  createdAt: string
  updatedAt: string
}

export type PartInput = Omit<InstalledPart, 'id' | 'createdAt' | 'updatedAt'>
