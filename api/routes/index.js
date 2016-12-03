var express = require('express');
var router = express.Router();
var ctrlItems = require('../controllers/items');
var ctrlBids = require('../controllers/bids');

router.get('/items', ctrlItems.itemsForBid);
router.post('/items', ctrlItems.itemsCreate);
router.get('/items/:itemId', ctrlItems.itemsReadOne);
router.put('/items/:itemId', ctrlItems.itemsUpdateOne);
router.delete('/items/:itemId', ctrlItems.itemsDeleteOne);

// reviews
router.post('/items/:itemId/bids', ctrlBids.bidsCreate);
router.get('/items/:itemId/bids/:bidId', ctrlBids.bidsReadOne);
router.put('/items/:itemId/bids/:bidId', ctrlBids.bidsUpdateOne);
router.delete('/items/:itemId/bids/:bidId', ctrlBids.bidsDeleteOne);

module.exports = router;
