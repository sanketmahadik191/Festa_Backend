import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
});

const menuSchema = new mongoose.Schema({
    categories: [categorySchema]
});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
