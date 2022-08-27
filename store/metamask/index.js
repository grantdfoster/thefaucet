import { ethers } from 'ethers'

export const state = () => ({
  accounts: null,
  network: null,
  mumbai: {
    chainName: 'Mumbai Testnet',
    // chainId: ethers.utils.stripZeros(ethers.utils.hexlify(80001)),
    chainId: '0x13881',
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  usdcBalance: 0,
  walletBalance: 0,
  stakedBalance: 0,
  rentalBalance: 0,
  tokenSupply: 500,
  tokenPrice: 50, // in dollars
  projection: 1, // years in which the projected data starts
  returnData: [
    { x: 0, y: 0 },
    { x: 0.25, y: 800 },
    { x: 0.5, y: 1350 },
    { x: 0.75, y: 2400 },
    { x: 1, y: 3575 },
    { x: 2, y: 6000 },
    { x: 3, y: 9050 },
    { x: 4, y: 13500 },
    { x: 5, y: 17500 },
    { x: 6, y: 21000 },
    { x: 7, y: 24500 },
    { x: 8, y: 27500 },
    { x: 9, y: 30505 },
    { x: 10, y: 34000 },
  ],
  growthData: [
    { x: 0.25, y: 25000 },
    { x: 0.5, y: 25500 },
    { x: 0.75, y: 26650 },
    { x: 1, y: 27575 },
    { x: 2, y: 29000 },
    { x: 3, y: 31500 },
    { x: 4, y: 33500 },
    { x: 5, y: 35000 },
    { x: 6, y: 37750 },
    { x: 7, y: 39150 },
    { x: 8, y: 43500 },
    { x: 9, y: 46000 },
    { x: 10, y: 49000 },
  ],
  yieldData: [
    { x: 0, y: 0 },
    { x: 0.25, y: 200 },
    { x: 0.5, y: 500 },
    { x: 0.75, y: 750 },
    { x: 1, y: 1000 },
    { x: 2, y: 2000 },
    { x: 3, y: 3000 },
    { x: 4, y: 4000 },
    { x: 5, y: 5000 },
    { x: 6, y: 6000 },
    { x: 7, y: 7000 },
    { x: 8, y: 8000 },
    { x: 9, y: 9000 },
    { x: 10, y: 10000 },
  ],
})

export const mutations = {
  setAccounts: (state, accounts) => {
    state.accounts = accounts
  },
  setNetwork: (state, network) => {
    state.network = network
  },
  setUsdcBalance: (state, _tokenCount) => {
    state.usdcBalance = _tokenCount
  },
  setWalletBalance: (state, _tokenCount) => {
    state.walletBalance = _tokenCount
  },
  setStakedBalance: (state, _tokenCount) => {
    state.stakedBalance = _tokenCount
  },
  setRentalBalance: (state, _tokenCount) => {
    state.rentalBalance = _tokenCount
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
      params: [state.mumbai],
    })
  },
  async connectWallet({ commit, getters, dispatch }) {
    const { provider } = getters

    const accounts = await provider.send('eth_requestAccounts')
    commit('setAccounts', accounts)
    dispatch('fetchBalances')
  },
  async getUsdcBalance({ commit, state, getters }) {
    const { accounts } = state
    const { provider } = getters

    const abi = require(`@/contracts/abi/USDC_TOKEN.json`)
    const contractAddress = process.env.USDCTOKEN
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const decimals = await contract.decimals()
    const balance = await contract.balanceOf(accounts[0])
    const formattedBalance = ethers.utils.formatUnits(balance, decimals)
    const _usdcBalance = parseFloat(formattedBalance)
    commit('setUsdcBalance', _usdcBalance)
  },
  async getWalletBalance({ commit, state, getters }) {
    const { accounts } = state
    const { provider } = getters

    const abi = require(`@/contracts/abi/PROP_TOKEN.json`)
    const contractAddress = process.env.PROPTOKEN
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const decimals = 0
    const balance = await contract.balanceOf(accounts[0])
    const formattedBalance = ethers.utils.formatUnits(balance, decimals)
    const _balance = parseFloat(formattedBalance)
    commit('setWalletBalance', _balance)
  },
  async getStakedBalance({ commit, state, getters }) {
    const { accounts } = state
    const { provider } = getters

    const abi = require(`@/contracts/abi/STAKING_CONTRACT.json`)
    const contractAddress = process.env.STAKINGCONTRACT
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const decimals = 0
    const poolId = 0
    const balance = await contract.balanceOf(poolId, accounts[0])
    const formattedBalance = ethers.utils.formatUnits(balance, decimals)
    const _balance = parseFloat(formattedBalance)
    commit('setStakedBalance', _balance)
  },
  async withdrawRentalBalance({ state, getters }) {
    const { rentalBalance } = state
    const { provider } = getters

    const abi = require(`@/contracts/abi/STAKING_CONTRACT.json`)
    const contractAddress = process.env.STAKINGCONTRACT
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
    const decimals = 6
    const poolId = 0
    console.log('rental balance: ', rentalBalance.toString())

    const formattedBalance = ethers.utils.parseUnits(rentalBalance.toString(), decimals)
    console.log('formatted balance: ', formattedBalance)
    const withdrawReceipt = await contract.withdraw(poolId, formattedBalance)
    const withdrawTx = await withdrawReceipt.wait(1)
    return withdrawTx
  },
  async getRentalBalance({ commit, state, getters }) {
    const { accounts } = state
    const { provider } = getters

    const abi = require(`@/contracts/abi/STAKING_CONTRACT.json`)
    const contractAddress = process.env.STAKINGCONTRACT
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const poolId = 0
    const balance = await contract.earned(poolId, accounts[0])
    // first item in balance is USDC
    const usdcBalance = balance[0]
    const decimals = 6
    const formattedBalance = ethers.utils.formatUnits(usdcBalance, decimals)
    const _balance = parseFloat(formattedBalance)
    commit('setRentalBalance', _balance)
  },
  async approveUsdc({ state, getters }, amount) {
    const { tokenPrice } = state
    const { provider } = getters

    const abi = require(`@/contracts/abi/USDC_TOKEN.json`)
    const contractAddress = process.env.USDCTOKEN
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
    const decimals = await contract.decimals()
    const usdcToApprove = amount * tokenPrice
    const usdcBig = ethers.utils.parseUnits(usdcToApprove.toString(), decimals)
    const approveReceipt = await contract.approve(process.env.SALECONTRACT, usdcBig)
    const approveTx = await approveReceipt.wait(1)
    return approveTx
  },
  async purchasePropTokens({ getters }, amount) {
    const { provider } = getters
    const abi = require(`@/contracts/abi/SALE_CONTRACT.json`)
    const contractAddress = process.env.SALECONTRACT
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
    const propTokenBig = ethers.utils.parseUnits(amount.toString(), 0)
    const purchaseReceipt = await contract.purchasePropertyTokens(propTokenBig)
    const purchaseTx = await purchaseReceipt.wait(1)
    return purchaseTx
  },
  async approvePropTokens({ getters }, amount) {
    const { provider } = getters
    const abi = require(`@/contracts/abi/PROP_TOKEN.json`)
    const contractAddress = process.env.PROPTOKEN
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
    const decimals = 0
    const propTokenBig = ethers.utils.parseUnits(amount.toString(), decimals)
    const approveReceipt = await contract.approve(process.env.STAKINGCONTRACT, propTokenBig)
    const approveTx = await approveReceipt.wait(1)
    return approveTx
  },
  async stakePropTokens({ getters }, amount) {
    const { provider } = getters
    const abi = require(`@/contracts/abi/STAKING_CONTRACT.json`)
    const contractAddress = process.env.STAKINGCONTRACT
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner())
    const decimals = 0
    const propTokenBig = ethers.utils.parseUnits(amount.toString(), decimals)
    const stakeReceipt = await contract.stake(0, propTokenBig)
    const stakeTx = await stakeReceipt.wait(1)
    return stakeTx
  },
  fetchBalances({ dispatch, state }) {
    const { accounts } = state
    if (accounts) {
      dispatch('getUsdcBalance')
      dispatch('getWalletBalance')
      dispatch('getStakedBalance')
      dispatch('getRentalBalance')
    }
  },
  disconnect({ commit }) {
    if (window?.ethereum?.disconnect) window.ethereum.disconnect()
    commit('setAccounts', null)
    commit('setUsdcBalance', 0)
    commit('setWalletBalance', 0)
    commit('setStakedBalance', 0)
    commit('setRentalBalance', 0)
  },
}

export const getters = {
  correctNetwork: (state) => {
    const { network, mumbai } = state
    // chainId from network comes back as int
    return network?.chainId === parseInt(mumbai?.chainId)
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
  projection: (state) => {
    return state.projection
  },
  returnData: (state) => {
    return state.returnData
  },
  growthData: (state) => {
    return state.growthData
  },
  yieldData: (state) => {
    return state.yieldData
  },
  returnPercentage: (state) => {
    const { returnData, projection } = state
    // calculate the % returned...
    const initialInvestment = 25000 // guys brought property for $25,000
    const filteredData = returnData.filter((d) => d.x <= projection)

    // the last datapoint represents current
    const lastDataPoint = filteredData[filteredData.length - 1]
    const growth = lastDataPoint.y / initialInvestment
    return (growth * 100).toFixed(1)
  },
  growthPercentage: (state) => {
    const { growthData, projection } = state
    // calculate the % returned...
    const initialInvestment = 25000 // guys brought property for $25,000
    const filteredData = growthData.filter((d) => d.x <= projection)

    // the last datapoint represents current
    const lastDataPoint = filteredData[filteredData.length - 1]
    const difference = lastDataPoint.y - initialInvestment
    const growth = difference / initialInvestment
    return (growth * 100).toFixed(1)
  },
  yieldPercentage: (state) => {
    const { yieldData, projection } = state
    // calculate the % returned...
    const initialInvestment = 25000 // guys brought property for $25,000
    const filteredData = yieldData.filter((d) => d.x <= projection)

    // the last datapoint represents current
    const lastDataPoint = filteredData[filteredData.length - 1]
    const growth = lastDataPoint.y / initialInvestment
    return (growth * 100).toFixed(1)
  },
  currentPropertyValue: (state) => {
    const { growthData, projection } = state
    const filteredData = growthData.filter((d) => d.x <= projection)
    const lastDataPoint = filteredData[filteredData.length - 1]
    return lastDataPoint.y
  },
  currentPortfolioValue: (state, getters) => {
    const { walletBalance, stakedBalance, tokenPrice } = state
    const { growthPercentage, yieldPercentage } = getters

    const tokenCount = walletBalance + stakedBalance
    const tokenValue = tokenCount * tokenPrice

    const growthValue = tokenValue * (growthPercentage / 100) + tokenValue
    const yieldValue = tokenValue * (yieldPercentage / 100)

    return growthValue + yieldValue
  },
  currentRentReceived: (state, getters) => {
    const { walletBalance, stakedBalance, tokenPrice } = state
    const { yieldPercentage } = getters

    const tokenCount = walletBalance + stakedBalance
    const tokenValue = tokenCount * tokenPrice

    const yieldValue = tokenValue * (yieldPercentage / 100)
    return yieldValue
  },
  tokenPrice: (state) => {
    return state.tokenPrice
  },
  usdcBalance: (state) => {
    return state.usdcBalance
  },
  walletBalance: (state) => {
    return state.walletBalance
  },
  stakedBalance: (state) => {
    return state.stakedBalance
  },
  rentalBalance: (state) => {
    return state.rentalBalance
  },
  percentageOwned: (state) => {
    const { walletBalance, stakedBalance, tokenSupply } = state
    return (walletBalance + stakedBalance) / tokenSupply
  },
}
