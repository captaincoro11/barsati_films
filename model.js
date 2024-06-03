// models/Trend.js
const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
    uniqueId: {
        type: mongoose.Schema.Types.ObjectId,
        alias: '_id' 
    },
    trends: [{ type: [String], required: true }],
    date:{
        type:Date,
        default:Date.now()
    },
    ipAddress: { type: String, required: true }
});

const Trend = mongoose.model('Trend', trendSchema);

module.exports = Trend;
