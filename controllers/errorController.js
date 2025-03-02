const appError = require("../utils/appError");

const handleCastErrorDB = err=>{
    const message = `Invalide ${err.path}: ${err.value}.`;
    return new appError(message,400);
}

const handleDuplicateFieldsDB = err=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError(message,400);
}

const handleValidationErrorDB = err=> {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalide input data. ${errors.join('. ')}`;
    return new appError(message,400);
}



const sendErrorDev = (err,res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};


const sendErrorProd = (err,res) =>{
    // Operational, trusted error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        // Programming or other unknown error: dont leak error details
    }else{
        console.log('ERROR',err);
        res.status(500).json({
            status: 'Error',
            message: 'Something went very wrong!'
        })
    }
  
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error Found';
   
   if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,res);
   }else if(process.env.NODE_ENV === 'production'){
    let error = {...err};
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(err,res);
   }
   }