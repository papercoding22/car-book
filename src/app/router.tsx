import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { CarDetailPage } from '../features/cars/pages/CarDetailPage'
import { CarFormPage } from '../features/cars/pages/CarFormPage'
import { CarsPage } from '../features/cars/pages/CarsPage'
import { ExpenseTimelinePage } from '../features/expenses/pages/ExpenseTimelinePage'
import { ExpenseListPage } from '../features/expenses/pages/ExpenseListPage'
import { PartsPage } from '../features/parts/pages/PartsPage'
import { SettingsPage } from '../features/settings/pages/SettingsPage'

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/new" element={<CarFormPage mode="create" />} />
          <Route path="/cars/:carId" element={<CarDetailPage />} />
          <Route path="/cars/:carId/edit" element={<CarFormPage mode="edit" />} />
          <Route path="/cars/:carId/expenses" element={<ExpenseTimelinePage />} />
          <Route path="/cars/:carId/expenses/all" element={<ExpenseListPage />} />
          <Route path="/cars/:carId/parts" element={<PartsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
