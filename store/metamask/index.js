import { ethers, providers, utils } from 'ethers'

export const state = () => ({
  network: null,
  walletAddress: null,
  faucetAddress: '0xFFE811714ab35360b67eE195acE7C10D93f89D8C',
  dripAddress: '0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333',
  dripBalance: 0,
  dripDeposited: 0,
  dripAvailable: 0,
  binanceSmartChain: {
    chainName: 'Binance Smart Chain',
    chainId: ethers.utils.hexlify(56),
    nativeCurrency: { name: 'BNB', decimals: 8, symbol: 'BNB' },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
})

export const mutations = {
  setNetwork: (state, _payload) => {
    state.network = _payload
  },
  setWalletAddress: (state, _payload) => {
    state.walletAddress = _payload
  },
  setDripBalance: (state, _balance) => {
    state.dripBalance = _balance
  },
  setDripDeposited: (state, _balance) => {
    state.dripDeposited = _balance
  },
  setDripAvailable: (state, _balance) => {
    state.dripAvailable = _balance
  },
}

export const actions = {
  async changeNetwork({ state }) {
    if (!window.ethereum) throw new Error('Please Use a Web3 Enabled Browser!')
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [state.binanceSmartChain],
    })
  },
  async connectMetamask({ commit, dispatch }) {
    if (window.ethereum) {
      const ethereum = window.ethereum
      const provider = new providers.Web3Provider(ethereum, 'any')

      try {
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const network = await provider.getNetwork()

        commit('setNetwork', Object.freeze(network))
        commit('setWalletAddress', address)

        await dispatch('fetchBalances')

        // set watcher on accounts changed
        ethereum.on('accountsChanged', async () => {
          console.log('accounts changed...')
          const signer = provider.getSigner()
          const address = await signer.getAddress()
          commit('setWalletAddress', address)
        })

        // set watcher on provider changed
        provider.on('network', (_newNetwork, _oldNetwork) => {
          if (_oldNetwork) {
            console.log('network changed...')
            const delayTime = 500
            this.app.$toast.info('Switching Networks...').goAway(delayTime)
            setTimeout(() => {
              window.location.reload()
            }, delayTime)
          }
        })
      } catch (error) {
        console.error(error)
        throw new Error('Error requesting account access or signer')
      }
    } else {
      throw new Error('Injected metamask provider not found')
    }
  },
  async fetchBalances({ dispatch }) {
    await dispatch('getDripBalance')
    await dispatch('getDripDeposited')
    await dispatch('getDripAvailable')
  },
  async getDripBalance({ commit, state, getters }) {
    const { walletAddress, dripAddress } = state
    const { provider } = getters

    const abi = require(`@/abi/drip.json`)
    const contract = new ethers.Contract(dripAddress, abi, provider)
    const decimals = await contract.decimals()
    const balance = await contract.balanceOf(walletAddress)
    const formattedBalance = utils.formatUnits(balance, decimals)
    const dripBalance = parseFloat(formattedBalance)
    commit('setDripBalance', dripBalance)
  },
  async getDripAvailable({ commit, state, getters }) {
    const { walletAddress, faucetAddress } = state
    const { provider } = getters

    const abi = require(`@/abi/faucet.json`)
    const contract = new ethers.Contract(faucetAddress, abi, provider)
    const decimals = 18 // drip token is 18 decimals
    const balance = await contract.claimsAvailable(walletAddress)
    const formattedBalance = utils.formatUnits(balance.toString(), decimals)
    const floatBalance = parseFloat(formattedBalance)
    commit('setDripAvailable', floatBalance)
  },
  async getDripDeposited({ commit, state, getters }) {
    const { walletAddress, faucetAddress } = state
    const { provider } = getters

    const abi = require(`@/abi/faucet.json`)
    const contract = new ethers.Contract(faucetAddress, abi, provider)
    const decimals = 18 // drip token is 18 decimals
    const info = await contract.userInfo(walletAddress)
    const formattedBalance = utils.formatUnits(info.deposits.toString(), decimals)
    const floatBalance = parseFloat(formattedBalance)
    commit('setDripDeposited', floatBalance)
  },
  // async approveUsdc({ state, getters }, amount) {
  //   const { tokenPrice } = state
  //   const { provider } = getters

  //   const abi = require(`@/contracts/abi/USDC_TOKEN.json`)
  //   const contractAddress = process.env.USDCTOKEN
  //   const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
  //   const decimals = await contract.decimals()
  //   const usdcToApprove = amount * tokenPrice
  //   const usdcBig = ethers.utils.parseUnits(usdcToApprove.toString(), decimals)
  //   const approveReceipt = await contract.approve(process.env.SALECONTRACT, usdcBig)
  //   const approveTx = await approveReceipt.wait(1)
  //   return approveTx
  // },
  disconnect({ commit }) {
    if (window?.ethereum?.disconnect) window.ethereum.disconnect()
    commit('setWalletAddress', null)
    commit('setDripBalance', 0)
    commit('setDripDeposited', 0)
    commit('setDripAvailable', 0)
  },
}

export const getters = {
  correctNetwork: (state) => {
    const { network, binanceSmartChain } = state
    return network?.chainId === parseInt(binanceSmartChain?.chainId)
  },
  provider: () => {
    if (!window.ethereum) return null
    return new providers.Web3Provider(window.ethereum, 'any')
  },
  network: (state) => {
    return state.network
  },
  walletAddress: (state) => {
    return state.walletAddress
  },
  dripBalance: (state) => {
    return state.dripBalance
  },
  dripDeposited: (state) => {
    return state.dripDeposited
  },
  dripAvailable: (state) => {
    return state.dripAvailable
  },
}
