const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Define middleware
app.use(bodyParser.json());
app.use(cors());

// Setting up https with Express
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(5001, () => {
    console.log('Server is running on https://96.236.218.144:5001');
});

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://linafu2:ilovetoro1290@logbook.37uspot.mongodb.net/?retryWrites=true&w=majority&appName=logbook';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Define Mongoose Schema
const Schema = mongoose.Schema;
const logEntrySchema = new Schema({
                                      content: String,
                                      createdAt: {
                                          type: Date,
                                          default: Date.now
                                      }
                                  });

// Create Mongoose Model
const LogEntry = mongoose.model('LogEntry', logEntrySchema);

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// POST Endpoint for Adding Log Entries
app.post('/entries', async (req, res) => {
    try {
        const {content} = req.body;

        // Create a new log entry
        const newLogEntry = new LogEntry({
                                             content
                                         });

        // Save the log entry to MongoDB
        const savedEntry = await newLogEntry.save();

        res.status(201).json(savedEntry);
    } catch (error) {
        console.error('Error saving log entry:', error);
        res.status(500).json({error: 'Failed to save log entry'});
    }
});

// Start server
const PORT = process.env.PORT || 5001;
const IP_ADDRESS = '96.236.218.144';
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});
