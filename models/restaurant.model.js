// restaurant.js
import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    location: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;


