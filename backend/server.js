const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(bodyParser.json());

const employeeRoutes = require('./routes/employees');
app.use('/employees', employeeRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));
