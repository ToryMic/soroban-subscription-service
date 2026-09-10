import * as StellarSdk from '@stellar/stellar-sdk'

type BalanceLine = StellarSdk.Horizon.HorizonApi.BalanceLine
type BalanceLineAsset = StellarSdk.Horizon.HorizonApi.BalanceLineAsset

export interface TokenBalance {
  code: string
  issuer?: string
  balance: number
  asset_type: string
}

export const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org'
export const HORIZON_MAINNET = 'https://horizon.stellar.org'

export const USDC_ISSUER =
  'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'

function horizonUrlForPassphrase(passphrase: string): string {
  if (passphrase === 'Public Global Stellar Network ; September 2015') {
    return HORIZON_MAINNET
  }
  return HORIZON_TESTNET
}

function isUsdc(balance: BalanceLine): boolean {
  if (balance.asset_type === 'native') return false
  const code = (balance as BalanceLineAsset).asset_code
  const issuer = (balance as BalanceLineAsset).asset_issuer
  return code === 'USDC' && issuer === USDC_ISSUER
}

export async function fetchBalances(
  publicKey: string,
  opts: { networkPassphrase: string },
): Promise<TokenBalance[]> {
  const horizonUrl = horizonUrlForPassphrase(opts.networkPassphrase)
  const server = new StellarSdk.Horizon.Server(horizonUrl)
  const account = await server.loadAccount(publicKey)

  return account.balances
    .filter((b) => b.asset_type === 'native' || isUsdc(b))
    .map((b) => {
      if (b.asset_type === 'native') {
        return {
          code: 'XLM',
          balance: Number.parseFloat(b.balance),
          asset_type: b.asset_type,
        }
      }
      const asset = b as BalanceLineAsset
      return {
        code: asset.asset_code,
        issuer: asset.asset_issuer,
        balance: Number.parseFloat(asset.balance),
        asset_type: asset.asset_type,
      }
    })
}

export function formatBalance(balance: number, code: string): string {
  return `${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${code}`
}