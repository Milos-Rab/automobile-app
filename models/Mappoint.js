const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Location = new Schema({
    lat: Number,
    lng: Number
})

const Mappoint = mongoose.model('Mappoint', {
    title: String,
    location: Location,
    condition: String,
    description: String,
    economic: String,
    createdBy: ObjectId,
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
}, 'mappoints');

module.exports = Mappoint;