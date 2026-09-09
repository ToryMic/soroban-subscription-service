import * as freighter from '@stellar/freighter-api'

declare global {
  interface Window {
    freighter?: unknown
  }
}

export const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015'

export interface WalletNetwork {
  name: string
  passphrase: string
  rpcUrl?: string
}

export function isFreighterInstalled(): boolean {
  return typeof window !== 'undefined' && Boolean(window.freighter)
}

export async function requestConnectionStatus(): Promise<boolean> {
  const { isConnected, error } = await freighter.isConnected()
  if (error) {
    throw new Error(error.message)
  }
  return isConnected
}

export async function requestAccess(): Promise<string> {
  const { address, error } = await freighter.getAddress()
  if (error) {
    throw new Error(error.message)
  }
  return address
}

export async function getWalletNetwork(): Promise<WalletNetwork> {
  const { network, networkPassphrase, networkUrl, sorobanRpcUrl, error } =
    await freighter.getNetworkDetails()

  if (error) {
    throw new Error(error.message)
  }

  return {
    name: network,
    passphrase: networkPassphrase,
    rpcUrl: sorobanRpcUrl ?? networkUrl,
  }
}
