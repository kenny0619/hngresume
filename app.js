const createError = require('http-errors');
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


// create connection to database
// data need to be stored online for ease of access from anywhere
const uri =
  "mongodb+srv://ibukunoluwa:J37XqVAVWWW6T9R@hng.0oimn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((conn) => {
    console.log("DB connection is successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

// create schema with mongoose
// it helps define the structure of the 
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

// create api endpoints for both hbs and post message api

app.get('/', function (req, res) {
  res.render('index', {
    title: "IBUKUNOLUWA'S RESUME"
  })
})

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const response = await Contact.create({
      name,
      email,
      message,
    });
    res.status(200).send({
      message: `Hi ${name}, your message has been received. you will get a response soon.`,
      response
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      message: error.message
    })
  }
});

app.get('/messages', async (req, res) => {
  try {
    const message = await Contact.find()
    res.status(200).send({
      message: `successful!`,
      response: message
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: error.message
    })
  }
})



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
