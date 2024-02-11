import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'


// we can also directly access them but we created this function .
const generateAccessAndRefreshTokens = async (userId) =>{
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // storing refreshToken of user in the database
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Tokens !!!")
    }
}

const registerUser = asyncHandler(async (req, res)=>{

    // steps:
    // extract data sent by user from frontend
    // validate that data
    // check whether user already created or not (using email or username)
    // check for images (i.e. uploaded or not)
    // upload images to cloudinary
    // create user object and insert into DB
    // remove password and refreshtoken from the response after entry
    // check for user creation
    // return res
    
    const {fullname, username, email, password} = req.body

    if ([fullname, username, email, password].some((field)=>{field?.trim() ===""})) {
        throw new ApiError(400, "All fields are required !!!")
    }

    const existedUser = await User.findOne({
        $or:[{username:username}, {email:email}]
    })
    
    if(existedUser){
        throw new ApiError(400, "User with this username or email already exists !!!")
    }

    const avatarLocalPath = req.files['avatar'][0]?.path // both syntax will get the local path of the uploaded file.

    // const coverImagePath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){   
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required !!!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath) // await coz image/video uploading might tak some time.
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar not uploaded !!!")
    }

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong, registering user !!!")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async(req, res)=>{
     
    // Steps:
    // get data from req.body
    // validate username & email
    // find user in DB
    // check password by comparing
    // generate accessToken & refreshToken
    // send tokens using cookies and response

    const {email, username, password} = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or Email is required !!!")
    }

    const fetchedUser = await User.findOne({
        $or :[{username}, {email}]
    })

    if (!fetchedUser) {
        throw new ApiError(404, "User doesn't exist !!!")
    }

    
    
    // methods created in userSchema can be only accessed via user created in the DB
    // you can not access these methods from 'User' model.
    const isPasswordValid = await fetchedUser.isPasswordCorrect(password)

    // const validPassword = await bcrypt.compare(password, getUser.password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect Password !!!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(fetchedUser._id)

    // yes, we can't send 'fetchedUser' as response coz this refrence doesn't have refreshToken field.
    // that's why we are again fetching the user for sending response to user.
    const loggedInUser = await User.findById(fetchedUser._id).select("-password -refreshToken")

    // options for cookies for security so, that only server can modify these cookies.
    const options = {
        httpOnly: true,
        secure: true
    }  

    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in Successfully"  )
    )

})

const logoutUser = asyncHandler(async(req, res)=>{
    // Steps:
    // clear cookies
    // clear refreshToken

    await User.findByIdAndUpdate(req.user._id,{
        // clearing refreshToken
        $set: {refreshToken:undefined}
    },
    {
        // so, that response will contain refreshToken: undefined (i.e. its new value)
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true
    }  

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out Successfully !!!"))

    
})

export {registerUser, loginUser, logoutUser}