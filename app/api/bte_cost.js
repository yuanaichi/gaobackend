const ApiError = require('../error/api_error');
const ApiErrorNames = require('../error/api_error_names');
const BteClaim = require('../models/bte_claim')

exports.getCost = async (ctx, next) => {
  let res = await BteClaim.find({}, null, {skip: 0, limit: 30, sort: {blockNumber: -1}}).exec();
  let ret = []

  for (let r of res) {
    ret.push({
      blockNumber: r.blockNumber,
      cost: ((r.attemptValue / 10 ** 10) / r.reward).toFixed(6)
    })
  }
  ctx.body = ret
}
