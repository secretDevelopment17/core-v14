const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
    caseID: {
        type: String,
        required: true
    },
    userID: {
        type: Number,
        required: true
    },
    globalName: {
        type: String,
        required: true
    },
    modType: {
        type: String,
        required: true
    },
    moderator: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Case", caseSchema);