import { useNavigate } from 'react-router-dom'

import { AppShell } from '@/components/route-balance/app-shell'
import { ImportFlow } from '@/components/route-balance/import-flow'

export function ImportPage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <ImportFlow
        onBack={() => navigate('/dashboard')}
        onProceed={(imported) => {
          navigate('/dashboard', {
            state: imported
              ? { toast: 'As informações foram carregadas com sucesso' }
              : undefined,
          })
        }}
      />
    </AppShell>
  )
}
