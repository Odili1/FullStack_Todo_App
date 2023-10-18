const mongoose = require('mongoose');

require('dotenv').config()


exports.connectDB = (uri) => {
    try {
        mongoose.connect(uri || process.env.DB_URI);

        mongoose.connection.on('connected', () => {
            console.log(`Database connected successfully`);
        });

        mongoose.connection.on("disconnected", () => console.log("mongoDb disconnected!"));

        mongoose.connection.on('error', (error) => {
            console.log(`An error occured while connecting to database ${error}`);
        })
    } catch (error) {
        console.log(`An error occured while connecting to database ${error}`);
    }
}