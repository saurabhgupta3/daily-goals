const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    percentage: {
        type: String,
        required: true,
    },
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
