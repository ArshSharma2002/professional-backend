/* NOTE :- (PRODUCTION GRADE code style) this is like a wrapper function coz we have may have to always wrap a function inside try/catch and make it async that's why we can directly pass that function into asyncHandler as an arguement and rest it will take care of it.  */

const asyncHandler = (requestHandler) => {async(req, res, next)=>{
    try {
        await requestHandler(req, res, next)

    } catch (error) {
        res.status(error.code||500).json({
            success: false,
            message: error.message
        })
    }
}
}

export {asyncHandler}

/* 
this is a higher order func. which takes fn func. as an arguement and wraps it inside try/catch block within async function.
const asyncHandler = () => {}
const asyncHandler = (fn) => { ()=>{ } }
const asyncHandler = (fn) => ()=>{ } 
*/
