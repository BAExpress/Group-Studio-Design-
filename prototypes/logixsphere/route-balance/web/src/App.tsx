import { Route, Routes } from 'react-router-dom'

import { DashboardPage } from '@/pages/dashboard-page'
import { ImportPage } from '@/pages/import-page'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/import" element={<ImportPage />} />
    </Routes>
  )
}
