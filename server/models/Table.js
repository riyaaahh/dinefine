const mongoose = require('mongoose');

const tableSchema = mongoose.Schema({
    number: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
