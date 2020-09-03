const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const {User} = require('../models/user');

router.post('/',async (req,res,next)=>{

    const result = await validateUser(req.body);
    if(result.error){
        res.status(400).render('login',{'message': result.error.details[0].message});
        return;
    }
    let user = await User.findOne({email : req.body.email});
    if(!user)
        return res.status(400).render('login',{'message': "Invalid email or Password"});

    let validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword)
        return res.status(400).render('login',{'message': "Invalid email or Password"});
    
    const token = await jwt.sign({_id : user._id,isAdmin : user.isAdmin},config.get('jwtPrivateKey'));
    res.cookie('x-auth-token',token,{ maxAge: 900000, httpOnly: false }).redirect("/item");      
});

function validateUser(user){
    var Schema = Joi.object({
        email : Joi.string().email().min(1).max(100).required(),
        password : Joi.string().min(1).max(1024).required(),
    });
    return Schema.validate(user);
}

module.exports = router;