const { model, Schema } = require('mongoose');

module.exports = model('Playlist', new Schema({
    _id: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    playlistName: {
        type: String,
        required: true,
    },
    playlist: {
        type: Array,
        default: [],
    },
    createdOn: {
        type: Number,
        required: false,
    },
}));
