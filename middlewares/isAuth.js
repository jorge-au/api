const {tokenVerify} = require("../utils/handleJWT");

const isAuth = async(req, res, next) => {
    try {
        if(!req.headers.authorization) {
            let error = new Error("No token provided")
            error.status = 403
            return next(error)
        }
        const token = req.headers.authorization.split(" ").pop();
        const isValidToken = await tokenVerify(token)
        if(isValidToken instanceof Error) {
            error.message = "Token invalid"
            error.status = 403
            return next(error)
        }
        req.token = isValidToken
        next()
    } catch (error) {
        error.message = "Internal Server Error"
        return error
    }
};

module.exports = isAuth;