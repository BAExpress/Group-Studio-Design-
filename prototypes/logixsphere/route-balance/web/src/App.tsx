import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardPage } from '@/pages/dashboard-page'
import { ImportPage } from '@/pages/import-page'

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/import" element={<ImportPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
