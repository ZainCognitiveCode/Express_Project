var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var sequelize = require('./config/database');
var customLogger = require('./middleware/logger');
const authenticateToken = require('./middleware/authMiddleware');
const port = 3000;

var postRoutes = require('./routes/posts');
var commentRoutes = require('./routes/comments');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(customLogger);

try {
  sequelize.authenticate().then(
    console.log('Connection has been established successfully.')
  )
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// Connection to MongoDB
mongoose.connect('mongodb+srv://xaingraphics69:N6xlLLCzAwOBieKQ@cluster0.yh4fp.mongodb.net/')
    .then(()=> console.log('MongoDB is Connected Successfully... '))
    .catch(()=> console.log('Error while connecting to MongoDB... '));




app.use('/', indexRouter);
app.use('/auth',authRouter);
app.use('/users',authenticateToken,usersRouter);
app.use('/posts',postRoutes);
app.use('/comments',commentRoutes);

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

// Checking JWT
// console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.listen(port, () => {
  console.log(` App is running on port ${port}...`)
})

module.exports = app;
