var mongoose = require('mongoose');

var bidSchema = new mongoose.Schema({
    username: {type: String, required: true},
    price: {
        type: Number,
        required: true
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        "default": 0
    },
    bids: [bidSchema]
});

mongoose.model('Item', itemSchema);