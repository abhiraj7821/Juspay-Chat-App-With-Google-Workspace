// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

// Custom Routes
const getRoter = require('./routes/getRoutes')
const ragRouter = require('./controllers/rag.pipeline');
const aiProcessingRouter = require('./controllers/ai.controllers');


// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true
}));

// Get Routes
app.use('/',getRoter);

// AI-Rag Implimentation
app.use('/', aiProcessingRouter);
app.use('/api', ragRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

