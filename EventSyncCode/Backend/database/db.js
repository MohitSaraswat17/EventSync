import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
    dbName: process.env.DB_NAME,

    }).then(()=>{
        console.log("Connected to Database Successfully");
    }).catch((err)=>{
        console.log(`Some Error Occured while connecting to Database ${err}`);
    });

}
