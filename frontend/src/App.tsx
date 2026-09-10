import { Routes, Route, Link } from 'react-router-dom'
import { WalletButton, WalletError } from './wallet/WalletButton'
import { ProviderLayout } from './provider/ProviderLayout'
import { ProviderDashboard } from './provider/ProviderDashboard'
import { ProviderPlans } from './provider/ProviderPlans'
import { ProviderRevenue } from './provider/ProviderRevenue'
import './App.css'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <nav className="nav">
        <div className="container nav__inner">
          <Link to="/" className="nav__brand">
            Soroban Subs
          </Link>
          <div className="nav__links">
            <Link to="/provider">Provider</Link>
            <Link to="/portal">Portal</Link>
          </div>
          <WalletButton />
        </div>
      </nav>
      <main className="container app__main">
        <WalletError />
        {children}
      </main>
    </div>
  )
}

function Landing() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Soroban Subscription Service
      </h1>
      <p
        style={{
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          fontSize: '1.15rem',
          maxWidth: '560px',
          marginInline: 'auto',
        }}
      >
        A native, standardized, reusable primitive for recurring subscription
        payments on Stellar.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/provider" className="btn-primary">
          Provider Dashboard
        </Link>
        <Link
          to="/portal"
          className="btn-primary"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
          }}
        >
          Subscriber Portal
        </Link>
      </div>
    </div>
  )
}

function SubscriberPortal() {
  return (
    <div style={{ padding: '2rem 0' }}>
      <h2>Subscriber Portal</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Browse plans and manage your active subscriptions.
      </p>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/provider" element={<ProviderLayout />}>
          <Route index element={<ProviderDashboard />} />
          <Route path="plans" element={<ProviderPlans />} />
          <Route path="revenue" element={<ProviderRevenue />} />
        </Route>
        <Route path="/portal/*" element={<SubscriberPortal />} />
      </Routes>
    </Layout>
  )
}

export default App