const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose.connect('mongodb://localhost/timefortime', { useNewUrlParser: true }, function(err) {
   if(err) console.log("ERROR")
   else console.log("connected")
})
 
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    secret:             'secret',
    resave:             true,
    saveUninitialized:  true,
    cookie:             {
            maxAge: 1000 * 60 *60 *24 *7
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // 1 day
    })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', require('./routes/authentication'));
app.use('/', require('./routes/author-profile/authorProfile'));
app.use('/', require('./routes/dashboard/allRequests'));
app.use('/', require('./routes/dashboard/directMessages'));
app.use('/', require('./routes/dashboard/myPetitions'));
app.use('/', require('./routes/dashboard/userSettings'));
app.use('/', require('./routes/main/displayOffers'));
app.use('/', require('./routes/main/search'));
app.use('/', require('./routes/publish-offer/publishOffer'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;