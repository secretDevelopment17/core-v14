const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Tag", tagSchema);
