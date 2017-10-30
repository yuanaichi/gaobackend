import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import bitcoineum_adapter from './Bitcoineum.json'
import 'colors'
import Mongoose from 'mongoose'
import Config from '../config'

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);

const bitcoineum = TruffleContract(bitcoineum_adapter)
bitcoineum.setProvider(provider);

Mongoose.connect(Config.mongodb_url, {useMongoClient: true})
Mongoose.Promise = global.Promise = require('bluebird')

var BteClaim = require('../app/models/bte_claim')

var watchLatestBlock = function() {
  let filter = web3.eth.filter('latest');
  filter.watch((error, result) => {
    if (!error) {
        console.log("latest block :".green, result, web3.eth.getBlock(result).number)
    }
  });
};

var getMiningAttempt = async function(blockNumber, from) {
  let bte = await bitcoineum.deployed()
  let miningAttempt = await bte.getMiningAttempt.call(blockNumber, from);
  return miningAttempt
};

var toBTE = function(value) {
  return value.dividedBy(100000000).valueOf();
};

var saveDB = async function(miner, blockNumber, ether, bter) {
  let bteClaim = new BteClaim({
    miner: miner,
    blockNumber: blockNumber,
    attemptValue: ether,
    reward: bter
  });

  bteClaim.save((err) => {
    if (err) {
      console.log("save db error".red, err);
    } else {
      console.log("save db ok".green);
    }
  });
};

var start = async function() {
  let bte = await bitcoineum.deployed();
  let address = await bitcoineum.address;
  console.log("Pool address is: " + address);

  watchLatestBlock();

  console.log("watching bitcoineum miningAttemptEvent event");

  let MiningAttemptEvent = bte.MiningAttemptEvent();
  MiningAttemptEvent.watch((error, result) => {
    if (!error) {
      console.log("miningAttemptEvent".green);

    } else {
      console.log("miningAttemptEvent" + error.red + ':', error);
    }
  });

  console.log("watching bitcoineum BlockClaimedEvent event");
  let BlockClaimedEvent = bte.BlockClaimedEvent();
  BlockClaimedEvent.watch((error, result) => {
    if (!error) {
      console.log("BlockClaimedEvent".green, result);

      //_from  _reward _blockNumber
      let {_from, _reward, _blockNumber} = result.args;
      //miningAttempts
      getMiningAttempt(_blockNumber, _from).then(miningAttempt => {
        let [projectedOffset, value, isCreated] = miningAttempt;
        console.log(projectedOffset.toString(), value.valueOf(), isCreated);
        //save to mongo
        //blockNumber 23111
        //attemptValue
        //reward
        //miner
        let attemptValue = value.valueOf();

        saveDB(_from, _blockNumber, attemptValue, _reward);
      });

    } else {
      console.log("BlockClaimedEvent" + error.red + ':' , error);
    }
  });
};


start();
