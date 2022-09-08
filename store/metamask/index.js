import { ethers } from 'ethers'

export const state = () => ({
  accounts: null,
  networkConnected: null,
  faucetAddress: '0xFFE811714ab35360b67eE195acE7C10D93f89D8C',
  dripAddress: '0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333',
  dripBalance: null,
  binanceSmartChain: {
    chainName: 'Binance Smart Chain',
    chainId: ethers.utils.hexlify(56),
    nativeCurrency: { name: 'BNB', decimals: 8, symbol: 'BNB' },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
})

export const mutations = {
  setAccounts: (state, _accounts) => {
    state.accounts = _accounts
  },
  setNetworkConnected: (state, _network) => {
    state.networkConnected = _network
  },
  setDripBalance: (state, _balance) => {
    state.dripBalance = _balance
  },
}

export const actions = {
  async initProvider({ commit, getters }) {
    if (!getters.provider) return
    // get and store the current network
    // must freeze to place into store state
    const network = await getters.provider.getNetwork()
    commit('setNetworkConnected', Object.freeze(network))

    // catch a network change and reload the application if detected
    const providerListener = new ethers.providers.Web3Provider(window.ethereum, 'any')

    providerListener.on('network', (_newNetwork, _oldNetwork) => {
      if (_oldNetwork) {
        const delayTime = 500
        this.app.$toast.info('Switching Networks...').goAway(delayTime)
        setTimeout(() => {
          window.location.reload()
        }, delayTime)
      }
    })
  },
  async changeNetwork({ state }) {
    if (!window.ethereum) throw new Error('Please Use a Web3 Enabled Browser!')
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [state.binanceSmartChain],
    })
  },
  async connectWallet({ commit, getters, dispatch }) {
    const { provider } = getters

    const accounts = await provider.send('eth_requestAccounts')
    commit('setAccounts', accounts)
    await dispatch('fetchBalances')
  },
  async fetchBalances({ dispatch }) {
    await dispatch('getDripBalance')
  },

  async getDripBalance({ commit, state, getters }) {
    const { accounts, dripAddress } = state
    const { provider } = getters

    const abi = require(`@/abi/drip.json`)
    const contract = new ethers.Contract(dripAddress, abi, provider)
    const decimals = await contract.decimals()
    const balance = await contract.balanceOf(accounts[0])
    const formattedBalance = ethers.utils.formatUnits(balance, decimals)
    const dripBalance = parseFloat(formattedBalance)
    commit('setDripBalance', dripBalance)
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
    commit('setAccounts', null)
    commit('setDripBalance', null)
  },
}

export const getters = {
  correctNetwork: (state) => {
    const { networkConnected, binanceSmartChain } = state
    return networkConnected?.chainId === parseInt(binanceSmartChain?.chainId)
  },
  provider: () => {
    if (!window.ethereum) return null
    return new ethers.providers.Web3Provider(window.ethereum)
  },
  network: (state) => {
    return state.network
  },
  accounts: (state) => {
    return state.accounts
  },
  dripBalance: (state) => {
    return state.dripBalance
  },
}
