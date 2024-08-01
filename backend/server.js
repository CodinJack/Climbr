const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

//db connect
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

//middleware
app.use(cors());
app.use(bodyParser.json());

//routes
const employeeRoutes = require('./routes/employees');
app.use('/employees', employeeRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

//start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
