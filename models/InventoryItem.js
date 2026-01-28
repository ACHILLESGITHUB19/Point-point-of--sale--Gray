import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    itemType: {
        type: String,
        required: true,
        enum: ['raw', 'finished', 'poultry'],
        default: 'finished'
    },
    category: {
        type: String,
        required: true
    },
    unit: {
        type: String, 
        required: true,
        default: 'pieces'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true
});

const InventoryItem = mongoose.model('InventoryItem', inventorySchema);

export default InventoryItem;