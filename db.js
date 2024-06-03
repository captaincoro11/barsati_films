const mongoose = require('mongoose');
const url = "mongodb+srv://PranjulShukla:beena55@cluster0.qicx6ls.mongodb.net/"

exports.connectDb=async()=>{
    await mongoose.connect(url).then((con)=>console.log(con.connection.host)).catch((error)=>console.log(error));

}