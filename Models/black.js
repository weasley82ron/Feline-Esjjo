const mongoose = require('mongoose');


const blacklistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true 
});


const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;
