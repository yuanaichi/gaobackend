var router = require('koa-router')();
var bte_cost_router = require('./bte_cost_router');

router.use('/bte-costs', bte_cost_router.routes(), bte_cost_router.allowedMethods());

module.exports = router;
