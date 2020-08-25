const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');
const colors = require('colors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const bodyParser = require('body-parser')


// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const home = require('./routes/home');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))


// Set views directory
app.set('views', __dirname + '/views');

// Tell express to use ejs as views engine
app.set('view engine', 'ejs');

app.set('layout', 'layouts/layout');

app.use(expressLayouts);

//  Dev logging middleware
app.use(morgan('dev'));

// Mount routers
app.use('/', home);

app.use(express.json());

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.PORT} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
