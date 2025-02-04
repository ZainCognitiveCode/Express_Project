const createError = require('http-errors');
const express = require('express');
const connectToMongo = require('./db/mongo');
const connectToSql = require('./db/sql');

require('dotenv').config();
const path = require('path');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
// var logger = require('morgan');

var customLogger = require('./middleware/logger');
const authenticateToken = require('./middleware/authMiddleware');


// Route Paths
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');




// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(customLogger);


// Calling the Connections
connectToMongo();
connectToSql();


// Calling the Routes
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


app.listen(port, () => {
  console.log(` App is running on port ${port}...`)
})

module.exports = app;
