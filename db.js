const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const url = process.env.MONGO_URI

exports.connectDb=async()=>{
    await mongoose.connect(url).then((con)=>console.log(con.connection.host)).catch((error)=>console.log(error));

}