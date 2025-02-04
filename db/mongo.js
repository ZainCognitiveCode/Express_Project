const mongoose = require('mongoose');
function connectToMongo() {
    mongoose.connect('mongodb+srv://xaingraphics69:N6xlLLCzAwOBieKQ@cluster0.yh4fp.mongodb.net/')
        .then(()=> console.log('MongoDB is Connected Successfully... '))
        .catch(()=> console.log('Error while connecting to MongoDB... '));

}
module.exports = connectToMongo;
