import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
const connectDB = async()=>{
    try {
        const connectionRes = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`connncted to HOST: ${connectionRes.connection.host}`);
        
    } catch (error) {
        console.error("MongoDB connection ERROR: ", error);
        process.exit(1) // to exit the process.
    }
}

export default connectDB