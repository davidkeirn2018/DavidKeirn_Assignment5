var mongoose = require('mongoose');
var Item = mongoose.model('Item');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET list of items */
module.exports.itemsForBid = function(req, res) {
    Item
        .find()
        .exec(
            function(err, results) {
                if (err) {
                    console.log('results error:', err);
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 200, results);
                }
            });
};

/* GET a item by the id */
module.exports.itemsReadOne = function(req, res) {
  console.log('Finding item details', req.params);
  if (req.params && req.params.itemId) {
    Item
      .findById(req.params.itemId)
      .exec(function(err, item) {
        if (!item) {
          sendJSONresponse(res, 404, {
            "message": "itemId not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(item);
        sendJSONresponse(res, 200, item);
      });
  } else {
    console.log('No itemId specified');
    sendJSONresponse(res, 404, {
      "message": "No itemId in request"
    });
  }
};

/* POST a new item */
/* /api/items */
module.exports.itemsCreate = function(req, res) {
    console.log(req.body);
    Item.create({
        name: req.body.name,
        description: req.body.description,
        startingPrice: req.body.startingPrice
    }, function(err, item) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            console.log(item);
            sendJSONresponse(res, 201, item);
        }
    });
};


/* PUT /api/items/:itemId */
module.exports.itemsUpdateOne = function(req, res) {
    if (!req.params.itemId) {
        sendJSONresponse(res, 404, {
            "message": "Not found, itemId is required"
        });
        return;
    }
    Item
        .findById(req.params.itemId)
        .select('-reviews -rating')
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
                item.name = req.body.name;
                item.description = req.body.description;
                item.startingPrice = req.body.startingPrice;
                item.save(function(err, item) {
                    if (err) {
                        sendJSONresponse(res, 404, err);
                    } else {
                        sendJSONresponse(res, 200, item);
                    }
                });
            }
        );
};

/* DELETE /api/items/:itemId */
module.exports.itemsDeleteOne = function(req, res) {
    var itemId = req.params.itemId;
    if (itemId) {
        Item
            .findByIdAndRemove(itemId)
            .exec(
                function(err, item) {
                    if (err) {
                        console.log(err);
                        sendJSONresponse(res, 404, err);
                        return;
                    }
                    console.log("Item id " + itemId + " deleted");
                    sendJSONresponse(res, 204, null);
                }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "No itemId"
        });
    }
};