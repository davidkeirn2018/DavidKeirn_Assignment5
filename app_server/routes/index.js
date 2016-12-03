var express = require('express');
var router = express.Router();
var ctrlItems = require('../controllers/items');

/* Items list page */
router.get('/', ctrlItems.angularApp);

module.exports = router;
