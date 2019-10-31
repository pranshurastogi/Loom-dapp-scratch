const express = require('express');
const app = express();
const port = 3003 || process.env.PORT;
const bodyParser = require('body-parser');

const { readFileSync } = require('fs')
const LoomTruffleProvider = require('loom-truffle-provider')
const path = require('path')
const { join } = require('path')

const Web3 = require('web3')
const connection = require('./connection')

const chainId    = 'extdev-plasma-us1'
const writeUrl   = 'http://extdev-plasma-us1.dappchains.com:80/rpc'
const readUrl    = 'http://extdev-plasma-us1.dappchains.com:80/query'
const privateKey = readFileSync(path.join(__dirname, 'private_key'), 'utf-8')

const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
const loomProvider = loomTruffleProvider.getProviderEngine()

loomTruffleProvider.createExtraAccounts(1)

// console.log("Accounts list", loomProvider.accountsAddrList)
// console.log("Accounts and Private Keys", loomProvider.accounts)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static('public_static'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

loadConnection()

async function loadConnection() {
	await connection.loadContract()	
}

app.get('/get_value', async (req, res) => {
  console.log("**** GET /getValue ****");
  try {
	var v = await connection.getValue()
	console.log(v)
  } catch (e) {
    console.log(e)
  }
  res.send(v)
});

app.post('/set_value', async (req, res) => {
  
  let int_value = req.body.int_value;
  console.log("**** GET /setValue ****");
  try {
	var sv = await connection.setValue(int_value);
	console.log("Resultss",sv)
  } catch (e) {
	console.log(e)
  }
  res.send(sv)
});

app.post('/registerOwner', async(req, res) => {
  console.log("**** Post/resgisterOwner ****");

  let shared_document_information = req.body.shared_document_information;
  let owner_address = req.body.owner_address;
 
  shared_document_information.toString();

  console.log({"PARAMS":req.body});

  try {
    await connection.registerOwner(shared_document_information,owner_address).then(data =>{
      console.log({"DATA":data});
      console.log(typeof(data))
      if (data != '')
      res.send({'Success':1,'Transaction_Details':data});
      else{
        res.send({'Success':0,'Message':'ERR'});
      }
    }).catch(err => {
      res.status(500).send({
      message: err.message || 'Some error occurred.'
    });
    })
    } catch (e) {
    console.log("Error",e)
    }
  
});


app.post('/getUIDOwner', async(req, res) => {
  console.log("**** Post/getSharedDocumentOwner ****");

  let shared_document_information = req.body.shared_document_information;

  shared_document_information.toString();

  console.log({"PARAMS":req.body});

  try {
    await connection.getUidOwner(shared_document_information).then(data =>{
      console.log({"DATA":data});
      console.log(typeof(data))
      if (data != '')
      res.send({'Success':1,'Owner':data});
      else{
        res.send({'Success':0,'Message':'ERR'});
      }
    }).catch(err => {
      res.status(500).send({
      message: err.message || 'Some error occurred.'
    });
    })
    } catch (e) {
    console.log("Error",e)
    }
  
});

app.listen(port, () => {
  console.log("Loom Express Listening at http://localhost:" + port);
});
