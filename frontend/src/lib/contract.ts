export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '') as `0x${string}`
export const DEPLOY_TX = (process.env.NEXT_PUBLIC_CONTRACT_DEPLOY_TX || '') as `0x${string}`

export const EXPLORER = 'https://explorer-bradbury.genlayer.com'
export const FAUCET_URL = 'https://testnet-faucet.genlayer.foundation/'

export const BRADBURY_CHAIN_ID = 4221
export const BRADBURY_CHAIN_ID_HEX = '0x107D'

export const BRADBURY_PARAMS = {
  chainId: BRADBURY_CHAIN_ID_HEX,
  chainName: 'GenLayer Bradbury Testnet',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: ['https://rpc-bradbury.genlayer.com'],
  blockExplorerUrls: ['https://explorer-bradbury.genlayer.com/'],
} as const

export const HAS_CONTRACT = CONTRACT_ADDRESS.length === 66 && CONTRACT_ADDRESS.startsWith('0x')

export const STATUS_NAME: Record<string, string> = {
  '1': 'PENDING',
  '2': 'PROPOSING',
  '3': 'COMMITTING',
  '4': 'REVEALING',
  '5': 'ACCEPTED',
  '6': 'UNDETERMINED',
  '7': 'FINALIZED',
  '8': 'CANCELED',
  '12': 'VALIDATORS_TIMEOUT',
  '13': 'LEADER_TIMEOUT',
}

export const TERMINAL_STATUSES = new Set(['ACCEPTED', 'FINALIZED', 'UNDETERMINED', 'CANCELED'])

export function statusName(s: unknown): string {
  return STATUS_NAME[String(s)] ?? String(s).toUpperCase()
}

export function explorerTx(hash: string): string {
  return `${EXPLORER}/tx/${hash}`
}

export function explorerAddr(addr: string): string {
  return `${EXPLORER}/address/${addr}`
}
