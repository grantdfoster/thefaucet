import { ethers } from 'ethers'

export const state = () => ({
  accounts: null,
  network: null,
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
  setAccounts: (state, accounts) => {
    state.accounts = accounts
  },
  setNetwork: (state, network) => {
    state.network = network
  },
  setDripBalance: (state, _balance) => {
    state.dripBalance = _balance
  },
}

export const actions = {
  async initProvider({ commit, getters }) {
    // get and store the current network
    const network = await getters.provider.getNetwork()
    commit('setNetwork', Object.freeze(network))

    // catch a network change and reload the application if detected
    const providerListener = new ethers.providers.Web3Provider(window.ethereum, 'any')

    providerListener.on('network', (_newNetwork, oldNetwork) => {
      if (oldNetwork) {
        const delayTime = 1500
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
    dispatch('fetchBalances')
  },
  async fetchBalances({ dispatch }) {
    await dispatch('getDripBalance')
  },

  async getDripBalance({ commit, state, getters }) {
    const { accounts } = state
    const { provider } = getters

    const abi = require(`@/abi/drip.json`)
    const contractAddress = process.env.DripAddress
    const contract = new ethers.Contract(contractAddress, abi, provider)
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
    const { network, binanceSmartChain } = state
    return network?.chainId === parseInt(binanceSmartChain?.chainId)
  },
  provider: () => {
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
