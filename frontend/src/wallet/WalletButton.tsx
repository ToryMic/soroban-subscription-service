import { useState } from 'react'
import { useWallet, truncateAddress } from './WalletContext'
import './WalletButton.css'

export function WalletButton() {
  const { installed, connected, address, loading, error, connect, disconnect } =
    useWallet()
  const [tooltip, setTooltip] = useState(false)

  if (!installed) {
    return (
      <a
        className="wallet-btn wallet-btn--install"
        href="https://freighter.app/"
        target="_blank"
        rel="noreferrer"
      >
        Install Freighter
      </a>
    )
  }

  if (loading) {
    return (
      <button className="wallet-btn" disabled>
        <span className="wallet-btn__spinner" aria-hidden="true" />
        Connecting&hellip;
      </button>
    )
  }

  if (connected && address) {
    return (
      <div
        className="wallet-btn__wrap"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <button
          className="wallet-btn wallet-btn--connected"
          onClick={connect}
          aria-label="Connected wallet account"
        >
          <span className="wallet-btn__dot" aria-hidden="true" />
          {truncateAddress(address)}
        </button>
        {tooltip && (
          <div className="wallet-btn__tooltip">
            <p className="wallet-btn__tooltip-addr">{address}</p>
            <button
              className="wallet-btn__disconnect"
              onClick={disconnect}
              type="button"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button className="wallet-btn wallet-btn--connect" onClick={connect}>
      {error ? 'Retry Connect' : 'Connect Wallet'}
    </button>
  )
}

export function WalletError() {
  const { error, installed } = useWallet()
  if (!error || !installed) return null
  return <div className="wallet-error">{error}</div>
}
