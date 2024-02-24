import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express()

// configurations for data using app.use()

// for allowing operations/accessing on user's cookies stored in browser.
app.use(cookieParser()) 

// for cors requests. we can use cors() package or we can use "proxy".
// app.use(cors({origin:process.env.CORS_ORIGIN}))
app.use(cors())

// to ensure that express understands json & to set limit for incoming json data.
app.use(express.json({limit:"16kb"})) 

// to ensure that express understands all the data coming through url's.
app.use(express.urlencoded({extended: true, limit:"16kb"})) 

// for storing static assets,files,images etc. in our server.
app.use(express.static("public")) 



import userRoutes from './routes/user.routes.js'

app.use("/api/v1/users",userRoutes)


export default app