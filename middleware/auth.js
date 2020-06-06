const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next) {
    // get token from header
    const token = req.header('x-auth-token')
    //check if no token 
    if (!token){
        return res.status(401).json({msg: 'No token- Authorization denied'})
    }

    //verify token
    try {
        const decoded = jwt.verify(token,config.get('jwtSecret'))
//gets the req.user from the request and puts it in the decoded user so we can use it anywhere in the protected routes
        req.user = decoded.user;
        next()
        
    } catch (err) {
        //runs if invalid token
        res.status(401).json({msg:'Token is not valid'})
    }
}