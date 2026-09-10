import { useWallet } from '../wallet/WalletContext'
import { PageHeader } from './ProviderLayout'

export function ProviderDashboard() {
  const { connected, networkMismatch } = useWallet()

  if (!connected) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back. Connect a wallet to see your provider overview."
        />
        <div className="card provider-empty" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            Connect your wallet to access the provider dashboard.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your subscription business."
      />
      <div className="provider-stats">
        <div className="card provider-stat">
          <span className="provider-stat__label">Active Plans</span>
          <span className="provider-stat__value">0</span>
        </div>
        <div className="card provider-stat">
          <span className="provider-stat__label">Active Subscribers</span>
          <span className="provider-stat__value">0</span>
        </div>
        <div className="card provider-stat">
          <span className="provider-stat__label">Total Revenue</span>
          <span className="provider-stat__value">0</span>
        </div>
      </div>
      {networkMismatch === 'custom' && (
        <div className="wallet-error" role="alert">
          Your wallet is on a custom network. Switch to testnet to use this app.
        </div>
      )}
    </>
  )
}

export default ProviderDashboard