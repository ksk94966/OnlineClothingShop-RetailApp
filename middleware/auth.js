const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req,res,next){

    //verifying the token is present or not
    const token = req.header('x-auth-token');
    if(!token)
    {
        //console.log("Token not found");
        res.status(401).send("Access Denied ! Token Not Found...");
        return;
    }

    try{
        //gets the payload here
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decoded; //this contains the payload
        next();
    }
    catch{
        console.log("Invalid token has been sent");
        res.status(403).send("Invalid Token.....");
        return;
    }

}

module.exports = auth;
