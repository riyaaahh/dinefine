const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
const getTables = async (req, res) => {
    try {
        const tables = await Table.find({});
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new table
// @route   POST /api/tables
const createTable = async (req, res) => {
    try {
        const { number } = req.body;

        const tableExists = await Table.findOne({ number });
        if (tableExists) {
            return res.status(400).json({ message: 'Table already exists' });
        }

        const table = await Table.create({ number });
        res.status(201).json(table);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
const deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (table) {
            await table.deleteOne();
            res.json({ message: 'Table removed' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTables,
    createTable,
    deleteTable
};
