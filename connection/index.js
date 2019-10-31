const Loom = require('loom-js')
const Client = Loom.Client
const LocalAddress = Loom.LocalAddress
const CryptoUtils = Loom.CryptoUtils
const LoomProvider = Loom.LoomProvider

const Web3 = require('web3')
const SimpleStore = require('../build/contracts/Counter.json')

module.exports = {
  loadContract: async function() {
    this._createClient()
    this._createCurrentUserAddress()
    this._createWebInstance()
    await this._createContractInstance()
  },
  _createClient: function() {
    console.log('create client started !!')

    this.privateKey = CryptoUtils.generatePrivateKey()
    this.publicKey = CryptoUtils.publicKeyFromPrivateKey(this.privateKey)
    // console.log("############ \n \n ", this.privateKey)
    // let writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc'
    // let readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query'
    // let networkId = 'extdev_plasma_us1'

    // if (process.env.NETWORK == 'extdev') {
      writeUrl = 'ws://extdev-plasma-us1.dappchains.com:80/websocket'
      readUrl = 'ws://extdev-plasma-us1.dappchains.com:80/queryws'
      networkId = 'extdev-plasma-us1'
    // }

    this.client = new Client(networkId, writeUrl, readUrl)
    // console.log('this.client: ', this.client)
    this.client.on('error', msg => {
      console.error('Error on connect to client', msg)
      console.warn('Please verify if loom command is running')
    })
  },


  _createCurrentUserAddress: function() {
    this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString()    
    console.log('this.currentUserAddress: ', this.currentUserAddress)
    return this.currentUserAddress
  },
  _createWebInstance: function() {
    this.web3 = new Web3(new LoomProvider(this.client, this.privateKey))    
    // console.log('this.web3: ', this.web3)
  },
  _createContractInstance: async function() {
    const networkId = '9545242630824'
    // console.log('SimpleStore: ', SimpleStore)
    this.currentNetwork = SimpleStore.networks[networkId]
    // console.log('this.currentNetwork', this.currentNetwork)

    if (!this.currentNetwork) {
      throw Error('Contract not deployed on DAppChain')
    }

    const ABI = SimpleStore.abi
    this.simpleStoreInstance = new this.web3.eth.Contract(ABI, this.currentNetwork.address, {
      from: this.currentUserAddress
    })

    // console.log('this.simpleStoreInstance: ', this.simpleStoreInstance)
  },
  

  setValue: async function(value,address) {
    console.log('contract: ', value)
    return await this.simpleStoreInstance.methods.set(value).send({
      from: address
    })
  },


  getValue: async function() {
    return await this.simpleStoreInstance.methods.get().call({
      from: this.currentUserAddress
    })
  },
  registerOwner: async function(uid,owner_address) {
    return await this.simpleStoreInstance.methods.registerOwner(uid,owner_address).send({
      from: this.currentUserAddress
    })
  },
  getUidOwner: async function(uid) {
    return await this.simpleStoreInstance.methods.getUidOwner(uid).call({
    })
  }
}

