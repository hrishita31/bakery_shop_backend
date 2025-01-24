const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/bakery_shop")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error: "));
db.once('open', ()=>{
    console.log("connected to mongoDB");
});