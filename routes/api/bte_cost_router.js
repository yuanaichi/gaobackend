var router = require('koa-router')();
var bteCost = require('../../app/api/bte_cost');

router.get('/', bteCost.getCost);

module.exports = router;
