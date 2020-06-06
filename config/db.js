const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')




//funciton to connect to db
const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
     
        console.log('db connected');
        
     } catch (err) {
         console.error(err);
         //exit with failure
         process.exit(1)
     }
}

module.exports = connectDB;