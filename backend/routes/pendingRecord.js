const express = require('express');
const PendingRecord = require('../models/PendingRecord');
const { startOfWeek, endOfWeek, formatISO } = require('date-fns');


const router = express.Router();




const getNext15Days = () => {
  const today = new Date();
  const next15Days = [];
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    next15Days.push(date.toISOString().split('T')[0]); // Return date in YYYY-MM-DD format
  }
  return next15Days;
};

// Get availability for the next 15 days
router.get('/availability', async (req, res) => {
  try {
    const dates = getNext15Days();
    const limit = 3; // Limit of records per day
    const availability = {};

    // Initialize availability object with dates and limits
    dates.forEach(date => {
      availability[date] = { count: 0, isAvailable: true };
    });

    // Count records for each date
    const records = await PendingRecord.aggregate([
      {
        $project: {
          proposedDate: { $dateToString: { format: "%Y-%m-%d", date: "$proposedDate" } }
        }
      },
      {
        $group: {
          _id: '$proposedDate',
          count: { $sum: 1 }
        }
      }
    ]);

    // Update availability based on the records count
    records.forEach(record => {
      const date = record._id;
      if (availability[date]) {
        availability[date].count = record.count;
        availability[date].isAvailable = record.count < limit;
      }
    });

    res.json(availability);
  } catch (error) {
    console.error('Error checking availability for next 15 days:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});


const getThisWeekDates = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // 0 for Sunday, 1 for Monday, etc.
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });
  return { start: formatISO(start), end: formatISO(end) };
};

// Get schedule for this week
router.get('/schedule', async (req, res) => {
  try {
    const { start, end } = getThisWeekDates();

    // Fetch records for the current week
    const records = await PendingRecord.find({
      proposedDate: { $gte: new Date(start), $lte: new Date(end) }
    });

    res.json(records);
  } catch (error) {
    console.error('Error fetching this week\'s schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});












const getNextSevenDays = () => {
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);
  return { start: today, end: endOfWeek };
};

// Get next seven days deliveries
router.get('/next-seven-days-deliveries', async (req, res) => {
  try {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    // Fetch records where proposedDeliveryDate is within the next seven days
    const records = await PendingRecord.find({
      proposedReportDate: { $gte: today, $lte: endOfWeek }
    }).sort({ proposedReportDate: -1 }).exec(); // Make sure to use exec() for proper query execution

    res.json(records);
    console.log("hello",records)
  } catch (error) {
    console.error('Error fetching next seven days deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch next seven days deliveries' });
  }
});



router.post('/check', async (req, res) => {
  try {
    const { proposedDate } = req.body;
    const limit = 5; // Set your limit here

    // Convert proposedDate to Date object
    const date = new Date(proposedDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ isAvailable: false });
    }

    // Count records with the same proposed date
    const count = await PendingRecord.countDocuments({ proposedDate: date });

    // Check if the count exceeds the limit
    const isAvailable = count < limit;
    res.json({ isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ isAvailable: false });
  }
});


// Create a new PendingRecord
router.post('/', async (req, res) => {
  try {
    const pendingRecord = new PendingRecord(req.body);
    await pendingRecord.save();
    res.status(201).send(pendingRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all PendingRecords
router.get('/', async (req, res) => {
  try {
    const pendingRecords = await PendingRecord.find({});
    res.status(200).send(pendingRecords);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a PendingRecord by ID
router.get('/:id', async (req, res) => {
  try {
    const pendingRecord = await PendingRecord.findById(req.params.id);
    if (!pendingRecord) {
      return res.status(404).send();
    }
    res.status(200).send(pendingRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a PendingRecord by ID
router.patch('/:id', async (req, res) => {
  try {
    const pendingRecord = await PendingRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pendingRecord) {
      return res.status(404).send();
    }
    res.status(200).send(pendingRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a PendingRecord by ID
router.delete('/:id', async (req, res) => {
  try {
    const pendingRecord = await PendingRecord.findByIdAndDelete(req.params.id);
    if (!pendingRecord) {
      return res.status(404).send();
    }
    res.status(200).send(pendingRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
