const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

require('./config/passport');

const port = 5000;
const uri = "mongodb+srv://jaikhanna615:iE0rAm2jjjLA87mY@climbrcluster.op1r68y.mongodb.net/?retryWrites=true&w=majority&appName=ClimbrCluster";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: uri })
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const employeeRoutes = require('./routes/employees');
app.use('/employees', employeeRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Authentication Routes
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
