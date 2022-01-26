const mongoose = require('mongoose');

const { MONGO_URI } = process.env;// getting mongo uri to connect
exports.connect = () => {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('db connection successful');
        })
        .catch(err => {
            console.log('db connection failed', err);
        })
}

