import { getAppData, saveAppData } from '../../services/storage/appData'
import { generateId } from '../../utils/id'
import type { InstalledPart, PartInput, PartStatus } from './part.types'

export const partRepository = {
  listByCar(carId: string): InstalledPart[] {
    return getAppData()
      .installedParts.filter((part) => part.carId === carId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  create(input: PartInput): InstalledPart {
    const data = getAppData()
    const now = new Date().toISOString()
    const created: InstalledPart = {
      id: generateId('part'),
      ...input,
      createdAt: now,
      updatedAt: now,
    }
    saveAppData({ ...data, installedParts: [created, ...data.installedParts] })
    return created
  },

  update(partId: string, input: PartInput): InstalledPart {
    const data = getAppData()
    const existing = data.installedParts.find((part) => part.id === partId)
    if (!existing) {
      throw new Error('Không tìm thấy phụ tùng')
    }

    const updated: InstalledPart = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }
    saveAppData({
      ...data,
      installedParts: data.installedParts.map((part) => (part.id === partId ? updated : part)),
    })
    return updated
  },

  updateStatus(partId: string, status: PartStatus): void {
    const data = getAppData()
    saveAppData({
      ...data,
      installedParts: data.installedParts.map((part) =>
        part.id === partId ? { ...part, status, updatedAt: new Date().toISOString() } : part,
      ),
    })
  },

  remove(partId: string): void {
    const data = getAppData()
    saveAppData({ ...data, installedParts: data.installedParts.filter((part) => part.id !== partId) })
  },
}
