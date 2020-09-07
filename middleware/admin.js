const jwt = require('jsonwebtoken');
const config = require('config');

function admin(req,res,next){

    const token = req.cookies['x-auth-token'];

    if(token){
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        //console.log(decoded);
        if(token && decoded.isAdmin)
        {
            //return res.status(403).send("UnAuthorized Access!!!");
            res.locals.isAdmin = true;
        }
        else{
            res.locals.isAdmin = false;
        }
    }
    else{
        res.locals.isAdmin = false;
    }
    
    
    next();
}

module.exports = admin;