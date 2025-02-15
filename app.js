const createError = require('http-errors');
const express = require('express');
const connectToMongo = require('./db/mongo');
const connectToSql = require('./db/sql');

process.on('uncaughtException', err => {
  console.log("Uncaught Exception! Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
})

require('dotenv').config();
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
// const logger = require('morgan');

const customLogger = require('./middleware/logger');
const authenticateToken = require('./middleware/authMiddleware');


// Route Paths
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');




// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// for using or serving static files, we do this
app.use(express.static(path.join(__dirname, 'public')));
// acces this url to check server static files rendering http://localhost:3000/images/863705.jpg
app.use(customLogger);



// Calling the Connections
connectToMongo();
connectToSql();


// Calling the Routes
app.use('/', indexRouter);
app.use('/auth',authRouter);
app.use('/users' ,authenticateToken,usersRouter);
app.use('/posts',postRoutes);
app.use('/comments',commentRoutes);


app.all('*',(req,res,next)=>{
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
})



// Error handler
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(` App is running on port ${port}...`)
})

process.on('unhandledRejection', err => {
  console.log("Unhandle Rejection! Shutting Down...");
  console.log(err.name, err.message);
  server.close(()=>{
  process.exit(1);
  })
})





//checking the environment of app
console.log(app.get('env'));



module.exports = app;
