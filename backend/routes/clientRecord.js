const express = require('express');
const ClientRecord = require('../models/ClientRecord');


const router = express.Router();

// Create a new ClientRecord
router.post('/', async (req, res) => {
  try {
    const clientRecord = new ClientRecord(req.body);
    await clientRecord.save();
    res.status(201).send(clientRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all ClientRecords
router.get('/', async (req, res) => {
  try {
    const clientRecords = await ClientRecord.find({});
    res.status(200).send(clientRecords);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a ClientRecord by ID
router.get('/:id', async (req, res) => {
  try {
    const clientRecord = await ClientRecord.findById(req.params.id);
    if (!clientRecord) {
      return res.status(404).send();
    }
    res.status(200).send(clientRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a ClientRecord by ID
router.patch('/:id', async (req, res) => {
  try {
    const clientRecord = await ClientRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!clientRecord) {
      return res.status(404).send();
    }
    res.status(200).send(clientRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a ClientRecord by ID
router.delete('/:id', async (req, res) => {
  try {
    const clientRecord = await ClientRecord.findByIdAndDelete(req.params.id);
    if (!clientRecord) {
      return res.status(404).send();
    }
    res.status(200).send(clientRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
