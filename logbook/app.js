const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5001;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model for log entries
const logSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model('Log', logSchema);

// Get all log entries
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await Log.find();
        res.send(logs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create a new log entry
app.post('/api/logs', async (req, res) => {
    try {
        const logEntry = new Log(req.body);
        await logEntry.save();
        res.status(201).send(logEntry);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

console.log(process.env.MONGO_URI);