const mongoose = require("mongoose");

const isMuteSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true
    },
    isMuted: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("isMute", isMuteSchema);