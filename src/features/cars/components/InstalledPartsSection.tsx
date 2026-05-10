import { ShieldCheck, Wrench } from 'lucide-react'
import { formatDate } from '../../../utils/formatDate'
import { formatOdo } from '../../../utils/formatOdo'
import type { InstalledPart, PartStatus } from '../../parts/part.types'

type InstalledPartsSectionProps = {
  parts: InstalledPart[]
}

const partStatusLabel: Record<PartStatus, string> = {
  active: 'Đang dùng',
  replaced: 'Đã thay',
  removed: 'Đã tháo',
  needs_check: 'Cần kiểm tra',
}

const partStatusBadgeClass: Record<PartStatus, string> = {
  active: 'border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]',
  replaced: 'border-[#06B6D4]/40 bg-[#06B6D4]/15 text-[#06B6D4]',
  removed: 'border-slate-500/50 bg-slate-500/15 text-slate-200',
  needs_check: 'border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#F59E0B]',
}

export function InstalledPartsSection({ parts }: InstalledPartsSectionProps) {
  const topFive = parts.slice(0, 5)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200">
          <Wrench size={18} className="text-blue-600" />
          Phụ tùng đang lắp
        </h3>
        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
          {topFive.length} mục
        </span>
      </div>

      <div className="space-y-3">
        {topFive.map((part) => (
          <div
            key={part.id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm transition hover:border-blue-600/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-200">{part.partName}</p>
                <p className="mt-0.5 text-xs text-slate-400">Thương hiệu: {part.brand || '-'}</p>
              </div>
              <span
                className={[
                  'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                  partStatusBadgeClass[part.status],
                ].join(' ')}
              >
                <ShieldCheck size={12} className="mr-1" />
                {partStatusLabel[part.status]}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-lg border border-slate-700 px-2 py-1">
                ODO lắp: {formatOdo(part.installedAtOdo)}
              </span>
              <span className="rounded-lg border border-slate-700 px-2 py-1">
                Ngày lắp: {part.installedDate ? formatDate(part.installedDate) : '-'}
              </span>
            </div>
          </div>
        ))}
        {parts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-4 text-center text-sm text-slate-300">
            Chưa có phụ tùng nào.
          </div>
        ) : null}
      </div>
    </div>
  )
}
