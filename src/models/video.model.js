import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // cloudnary url
        required: [true, "video is required"]
    },
    thumbnail:{
        type: String, // cloudnary url
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number, // using cloudnary
        required: true
    },
    views:{
        type: Number,
        default:0
    },
    ispublished:{
        type: boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }


},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)
 
export const Video = mongoose.model("Video", videoSchema)