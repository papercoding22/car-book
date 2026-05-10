import { exportCsvData, exportData, importData, resetAppData } from '../../../services/storage/appData'
import type { ChangeEventHandler } from 'react'
import { useTheme } from '../../../app/theme'

const APP_VERSION = '1.0.0'

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  const onExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `garage-log-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(href)
  }

  const onExportCsv = () => {
    const dateSuffix = new Date().toISOString().slice(0, 10)
    const files = exportCsvData()

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/csv;charset=utf-8;' })
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = `garage-log-${dateSuffix}-${file.filename}`
      link.click()
      URL.revokeObjectURL(href)
    })
  }

  const onImport: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      importData(text)
      window.alert('Nhập dữ liệu thành công')
      window.location.reload()
    } catch {
      window.alert('File JSON không hợp lệ')
    }
  }

  const onReset = () => {
    if (!window.confirm('Bạn chắc chắn muốn xóa toàn bộ dữ liệu local?')) {
      return
    }
    resetAppData()
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold text-slate-200">Cài đặt ứng dụng</h2>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-200">Giao diện</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={[
                'rounded-xl border px-4 py-2 text-sm',
                theme === 'light'
                  ? 'border-blue-600 bg-blue-600/20 text-blue-200'
                  : 'border-slate-700 text-slate-200 hover:bg-slate-800',
              ].join(' ')}
            >
              Light mode
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={[
                'rounded-xl border px-4 py-2 text-sm',
                theme === 'dark'
                  ? 'border-blue-600 bg-blue-600/20 text-blue-200'
                  : 'border-slate-700 text-slate-200 hover:bg-slate-800',
              ].join(' ')}
            >
              Dark mode
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-300">Dữ liệu hiện đang được lưu trong Local Storage trên thiết bị này.</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExport}
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-slate-200 hover:bg-blue-700"
          >
            Xuất dữ liệu JSON
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="rounded-xl border border-blue-600 px-4 py-2 font-medium text-blue-200 hover:bg-blue-600/20"
          >
            Xuất dữ liệu CSV
          </button>
          <label className="cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-slate-100 hover:bg-slate-800">
            Nhập dữ liệu JSON
            <input type="file" accept="application/json" className="hidden" onChange={onImport} />
          </label>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-red-500/70 px-4 py-2 text-red-400 hover:bg-red-500/15"
          >
            Xóa toàn bộ dữ liệu
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-300">
        <p>Version: {APP_VERSION}</p>
      </section>
    </div>
  )
}
