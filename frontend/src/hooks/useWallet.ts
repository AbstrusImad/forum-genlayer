'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BRADBURY_PARAMS, BRADBURY_CHAIN_ID } from '@/lib/contract'

interface WalletState {
  address: string | null
  chainId: number | null
  balance: string | null
  connecting: boolean
  error: string | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    balance: null,
    connecting: false,
    error: null,
  })
  const alive = useRef(true)

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null
    return (window as any).ethereum ?? null
  }, [])

  const fetchBalance = useCallback(async (addr: string) => {
    const provider = getProvider()
    if (!provider) return null
    try {
      const bal = await provider.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      })
      const wei = BigInt(bal)
      const gen = Number(wei) / 1e18
      return gen.toFixed(2)
    } catch {
      return null
    }
  }, [getProvider])

  const updateChain = useCallback(async () => {
    const provider = getProvider()
    if (!provider) return
    try {
      const chainHex = await provider.request({ method: 'eth_chainId' })
      const id = parseInt(chainHex, 16)
      if (alive.current) {
        setState(prev => ({ ...prev, chainId: id }))
      }
    } catch {
      // silent
    }
  }, [getProvider])

  const connect = useCallback(async () => {
    const provider = getProvider()
    if (!provider) {
      setState(prev => ({ ...prev, error: 'No wallet detected. Install MetaMask or a compatible wallet.' }))
      return
    }

    setState(prev => ({ ...prev, connecting: true, error: null }))

    try {
      const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' })
      if (!accounts.length) throw new Error('No accounts returned')

      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [BRADBURY_PARAMS],
        })
      } catch {
        // chain may already exist
      }

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BRADBURY_PARAMS.chainId }],
        })
      } catch (switchErr: any) {
        if (switchErr?.code !== 4902) {
          // 4902 = chain not added, already handled above
        }
      }

      const addr = accounts[0]
      const chainHex = await provider.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainHex, 16)
      const balance = await fetchBalance(addr)

      if (alive.current) {
        setState({
          address: addr,
          chainId,
          balance,
          connecting: false,
          error: null,
        })
      }
    } catch (err: any) {
      if (alive.current) {
        const code = err?.code
        const msg = code === 4001
          ? 'You cancelled the connection request.'
          : err?.message || 'Failed to connect wallet.'
        setState(prev => ({
          ...prev,
          connecting: false,
          error: msg,
        }))
      }
    }
  }, [getProvider, fetchBalance])

  const disconnect = useCallback(() => {
    setState({
      address: null,
      chainId: null,
      balance: null,
      connecting: false,
      error: null,
    })
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!state.address) return
    const balance = await fetchBalance(state.address)
    if (alive.current) {
      setState(prev => ({ ...prev, balance }))
    }
  }, [state.address, fetchBalance])

  useEffect(() => {
    alive.current = true
    const provider = getProvider()
    if (!provider) return

    const onAccountsChanged = (accounts: string[]) => {
      if (!accounts.length) {
        disconnect()
      } else {
        setState(prev => ({ ...prev, address: accounts[0] }))
        fetchBalance(accounts[0]).then(bal => {
          if (alive.current) setState(prev => ({ ...prev, balance: bal }))
        })
      }
    }

    const onChainChanged = () => {
      updateChain()
      if (state.address) {
        fetchBalance(state.address).then(bal => {
          if (alive.current) setState(prev => ({ ...prev, balance: bal }))
        })
      }
    }

    provider.on('accountsChanged', onAccountsChanged)
    provider.on('chainChanged', onChainChanged)

    return () => {
      alive.current = false
      provider.removeListener('accountsChanged', onAccountsChanged)
      provider.removeListener('chainChanged', onChainChanged)
    }
  }, [getProvider, disconnect, updateChain, state.address, fetchBalance])

  const isCorrectChain = state.chainId === BRADBURY_CHAIN_ID

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
    isCorrectChain,
    hasProvider: typeof window !== 'undefined' && !!(window as any).ethereum,
  }
}
