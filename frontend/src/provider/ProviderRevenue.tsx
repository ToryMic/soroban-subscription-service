import { useWallet } from '../wallet/WalletContext'
import { PageHeader } from './ProviderLayout'

export function ProviderRevenue() {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <>
        <PageHeader title="Revenue" />
        <div className="card provider-empty" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Connect your wallet to view revenue.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Revenue" subtitle="Track payments collected." />
      <div className="card" style={{ color: 'var(--text-secondary)' }}>
        Revenue stats will be shown here.
      </div>
    </>
  )
}

export default ProviderRevenue