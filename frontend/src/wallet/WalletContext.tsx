import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  getWalletNetwork,
  isFreighterInstalled,
  requestAccess,
  requestConnectionStatus,
  TESTNET_PASSPHRASE,
  type WalletNetwork,
} from './freighter'
import { fetchBalances, type TokenBalance } from './balances'

export type NetworkMismatch =
  | 'unknown'
  | 'testnet'
  | 'custom'
  | 'not-connected'

export interface WalletState {
  installed: boolean
  connected: boolean
  address: string | null
  network: WalletNetwork | null
  networkMismatch: NetworkMismatch
  balances: TokenBalance[] | null
  balancesLoading: boolean
  loading: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalances: () => Promise<void>
}

const WalletContext = createContext<WalletState | null>(null)

function detectMismatch(
  connected: boolean,
  network: WalletNetwork | null,
): NetworkMismatch {
  if (!connected || !network) return 'not-connected'
  if (network.passphrase === TESTNET_PASSPHRASE) return 'testnet'
  if (network.name === 'testnet' || network.name === 'TESTNET') return 'testnet'
  return 'custom'
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [installed, setInstalled] = useState(false)
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [network, setNetwork] = useState<WalletNetwork | null>(null)
  const [balances, setBalances] = useState<TokenBalance[] | null>(null)
  const [balancesLoading, setBalancesLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshBalances = useCallback(async () => {
    if (!address || !network) {
      setBalances(null)
      return
    }
    setBalancesLoading(true)
    try {
      const next = await fetchBalances(address, {
        networkPassphrase: network.passphrase,
      })
      setBalances(next)
      setError(null)
    } catch (e) {
      setBalances(null)
      setError(
        e instanceof Error
          ? `Failed to fetch balances: ${e.message}`
          : 'Failed to fetch balances',
      )
    } finally {
      setBalancesLoading(false)
    }
  }, [address, network])

  useEffect(() => {
    void refreshBalances()
  }, [refreshBalances])

  const sync = useCallback(async () => {
    if (!isFreighterInstalled()) {
      setInstalled(false)
      setConnected(false)
      return
    }
    setInstalled(true)

    try {
      const isConnected = await requestConnectionStatus()
      setConnected(isConnected)

      if (isConnected) {
        const newAddress = await requestAccess()
        const newNetwork = await getWalletNetwork()
        setAddress(newAddress)
        setNetwork(newNetwork)
        setError(null)
      } else {
        setAddress(null)
        setNetwork(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read wallet state')
    }
  }, [])

  useEffect(() => {
    void sync()
  }, [sync])

  const connect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isFreighterInstalled()) {
        throw new Error(
          'Freighter is not installed. Install the Freighter wallet extension to continue.',
        )
      }
      const newAddress = await requestAccess()
      const newNetwork = await getWalletNetwork()
      setAddress(newAddress)
      setNetwork(newNetwork)
      setConnected(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setConnected(false)
    setAddress(null)
    setNetwork(null)
    setBalances(null)
    setError(null)
  }, [])

  const value = useMemo<WalletState>(
    () => ({
      installed,
      connected,
      address,
      network,
      networkMismatch: detectMismatch(connected, network),
      balances,
      balancesLoading,
      loading,
      error,
      connect,
      disconnect,
      refreshBalances,
    }),
    [
      installed,
      connected,
      address,
      network,
      balances,
      balancesLoading,
      loading,
      error,
      connect,
      disconnect,
      refreshBalances,
    ],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return ctx
}

export function truncateAddress(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail) return addr
  return `${addr.slice(0, head)}\u2026${addr.slice(-tail)}`
}
