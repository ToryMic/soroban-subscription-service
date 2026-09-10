import { useWallet } from '../wallet/WalletContext'
import { PageHeader } from './ProviderLayout'

export function ProviderPlans() {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <>
        <PageHeader title="Plans" />
        <div className="card provider-empty" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Connect your wallet to manage plans.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Plans" subtitle="Manage your subscription plans." />
      <div className="card" style={{ color: 'var(--text-secondary)' }}>
        No plans yet. Creating plans lands here in an upcoming slice.
      </div>
    </>
  )
}

export default ProviderPlans