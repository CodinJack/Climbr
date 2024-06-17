const mongoose = require('mongoose');

const uri = process.env.URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
