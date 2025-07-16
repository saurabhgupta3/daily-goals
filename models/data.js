const mongoose = require("mongoose");
const { type } = require("os");

const dataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    check: {
        type: Boolean,
        default: false,
    },
});

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;
