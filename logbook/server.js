const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Define middleware
app.use(bodyParser.json());
app.use(cors());

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

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!'); // Replace with your actual route handlers
});

// Start server
const PORT = process.env.PORT || 5001;
const IP_ADDRESS = '96.236.218.144';
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});
