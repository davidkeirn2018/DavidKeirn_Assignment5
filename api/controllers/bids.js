var mongoose = require('mongoose');
var Item = mongoose.model('Item');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/* POST a new bid, providing a itemId */
/* /api/items/:itemId/bid */
module.exports.bidsCreate = function(req, res) {
    if (req.params.itemId) {
        Item
            .findById(req.params.itemId)
            .select('bids')
            .exec(
                function(err, item) {
                    if (err) {
                        sendJSONresponse(res, 400, err);
                    } else {
                        doAddBid(req, res, item);
                    }
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, itemId required"
        });
    }
};

var doAddBid = function(req, res, item) {
    if (!item) {
        sendJSONresponse(res, 404, "itemId not found");
    } else {
        item.bids.push({
            username: req.body.username,
            price: req.body.price
        });
        item.save(function(err, thisBid) {
            if (err) {
                sendJSONresponse(res, 400, err);
            } else {
                sendJSONresponse(res, 201, thisBid);
            }
        });
    }
};

module.exports.bidsUpdateOne = function(req, res) {
    if (!req.params.itemId || !req.params.bidId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, itemId and bidId are both required"
        });
        return;
    }
    Item
        .findById(req.params.itemId)
        .select('bids')
        .exec(
            function(err, item) {
                var thisbid;
                if (!item) {
                    sendJSONresponse(res, 404, {
                        "message": "itemId not found"
                    });
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                if (item.bids && item.bids.length > 0) {
                    thisbid = item.bids.id(req.params.bidid);
                    if (!thisbid) {
                        sendJSONresponse(res, 404, {
                            "message": "bidId not found"
                        });
                    } else {
                        thisbid.username = req.body.username;
                        thisbid.price = req.body.price;
                        thisbid.createdOn = req.body.createdOn;
                        item.save(function(err, item) {
                            if (err) {
                                sendJSONresponse(res, 404, err);
                            } else {
                                sendJSONresponse(res, 200, thisbid);
                            }
                        });
                    }
                } else {
                    sendJSONresponse(res, 404, {
                        "message": "No bid to update"
                    });
                }
            }
        );
};

module.exports.bidsReadOne = function(req, res) {
    console.log("Getting single bid");
    if (req.params && req.params.itemid && req.params.bidid) {
        Item
            .findById(req.params.itemid)
            .select('name bids')
            .exec(
                function(err, item) {
                    console.log(item);
                    var response, bid;
                    if (!item) {
                        sendJSONresponse(res, 404, {
                            "message": "itemId not found"
                        });
                        return;
                    } else if (err) {
                        sendJSONresponse(res, 400, err);
                        return;
                    }
                    if (item.bids && item.bids.length > 0) {
                        bid = item.bids.id(req.params.bidid);
                        if (!bid) {
                            sendJSONresponse(res, 404, {
                                "message": "bidId not found"
                            });
                        } else {
                            response = {
                                item: {
                                    name: item.name,
                                    id: req.params.itemid
                                },
                                bid: bid
                            };
                            sendJSONresponse(res, 200, response);
                        }
                    } else {
                        sendJSONresponse(res, 404, {
                            "message": "No bids found"
                        });
                    }
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, itemId and bidId are both required"
        });
    }
};

// app.delete('/api/items/:itemid/bids/:bidid'
module.exports.bidsDeleteOne = function(req, res) {
    if (!req.params.itemId || !req.params.bidId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, itemId and bidId are both required"
        });
        return;
    }
    Item
        .findById(req.params.itemId)
        .select('bids')
        .exec(
            function(err, item) {
                if (!item) {
                    sendJSONresponse(res, 404, {
                        "message": "itemId not found"
                    });
                    return;
                } else if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                if (item.bids && item.bids.length > 0) {
                    if (!item.bids.id(req.params.bidid)) {
                        sendJSONresponse(res, 404, {
                            "message": "bidId not found"
                        });
                    } else {
                        item.bids.id(req.params.bidid).remove();
                        item.save(function(err) {
                            if (err) {
                                sendJSONresponse(res, 404, err);
                            } else {
                                updateAverageRating(item._id);
                                sendJSONresponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJSONresponse(res, 404, {
                        "message": "No bid to delete"
                    });
                }
            }
        );
};
