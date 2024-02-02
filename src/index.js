import dotenv from "dotenv" // for instantly loading our .env variables
import connectDB from "./db/connection.js"
import app from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.on("error",()=>{
            console.log("ERROR: ", error);
            throw error
        })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`listening at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!!");
})


/* NOTE :- always use async await and try catch while defining connection function of DB coz there are chances of errors or exceptions i.e use method-2 */

/*
method-1
function connectDB("* connection code  *")
connectDB() //execute connect func 

method-2
use IIFE's and async/await with try & catch for error handling 

*/

/*
// import express from "express";
// const app = express()
// import {DB_NAME} from "./constants"
// import mongoose from "mongoose"

;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("ERROR: ", error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening at port ${process.env.PORT}`);
        })
    }catch(error){
        console.error("ERROR: ", error)
        throw err
    }
})()

*/