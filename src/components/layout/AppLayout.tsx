import { Car, GaugeCircle, Settings } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Tổng quan', icon: GaugeCircle, end: true },
  { to: '/cars', label: 'Danh sách xe', icon: Car },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="block">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Garage Log</p>
            <h1 className="text-2xl font-semibold text-slate-200">Quản lý xe cá nhân</h1>
          </Link>
          <nav className="flex gap-2 rounded-full border border-slate-700 bg-slate-900 p-1">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 rounded-full px-3 py-2 text-sm transition',
                      isActive ? 'bg-blue-600 text-slate-200' : 'text-slate-200 hover:bg-slate-800',
                    ].join(' ')
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
