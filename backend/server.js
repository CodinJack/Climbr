const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = 5000;
const uri = "mongodb+srv://jaikhanna615:iE0rAm2jjjLA87mY@climbrcluster.op1r68y.mongodb.net/?retryWrites=true&w=majority&appName=ClimbrCluster";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.listen(port, () => console.log(`Server listening on port ${port}`));
