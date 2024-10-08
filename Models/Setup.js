const { model, Schema } = require("mongoose");

const Setup = new Schema({
    _id: {
        type: String,
        required: true,
    },

    channel: {
        type: String,
        required: true,
    },

    setuped: {
        type: Boolean,
        default: false,
    },

    message: {
        type: String,
        required: true,
    },

    moderator: {
        type: String,
        required: true,
    },

    lastUpdated: {
        type: String,
        default: new Date().getDate(),
    },

    logs: {
        type: Array,
        default: null,
    },
});
module.exports = model("setup", Setup);
