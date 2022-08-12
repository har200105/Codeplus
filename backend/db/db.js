const mongoose = require("mongoose");


const db = async () => {
    await mongoose.connect(process.env.DB_URL).then(() => {
        console.log(`Connected to Database`);
    });
}

module.exports = db;