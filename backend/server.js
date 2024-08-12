const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

const auth = require('./middleware/authMiddleware');

//db connect
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

//routes
const employeeRoutes = require('./routes/employeeRoute');
app.use('/employees', auth, employeeRoutes);

const taskRoutes = require('./routes/taskRoute');
app.use('/tasks', auth, taskRoutes);

const authRoutes = require('./routes/authRoute');
app.use('/auth', authRoutes);

//start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
