const mongoose = require('mongoose');
function connectToMongo() {
    const db = process.env.MONGODB;
    mongoose.connect(db)
        .then(() => console.log('MongoDB is Connected Successfully... '));


  
}
module.exports = connectToMongo;
