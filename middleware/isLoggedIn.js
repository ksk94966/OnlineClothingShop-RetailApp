const jwt = require('jsonwebtoken');
const config = require('config');


function isLoggedIn(req,res,next){
    const token = req.cookies['x-auth-token'];
    if(!token)
    {
        res.locals.loggedIn = false;
    }
    else
    {
        res.locals.loggedIn = true;
    }
    next();
}


module.exports = isLoggedIn;