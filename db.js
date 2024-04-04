
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/voting'; // Replace my db with database name
//const mongoURL ='mongodb+srv://vishalbhateria:Vishu@cluster0.bqjyv1j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
require('dotenv').config();
//const mongoURL =process.env.MONGODB_URL_LOCAL
//const mongoURL = process.env.MONGODB_URL;

// Setup MongoDB connection
mongoose.connect(mongoURL ,{
    useNewUrlParser: true,
    useUnifiedTopology: true});
   


// Get the default connection
const db = mongoose.connection;

// Define event listeners
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error("MongoDB connection erro", err);
});

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

// Export the database connection
module.exports = db;


