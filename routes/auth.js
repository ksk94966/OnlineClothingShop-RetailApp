const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const {User} = require('../models/user');

router.post('/',async (req,res,next)=>{

    const result = await validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let user = await User.findOne({email : req.body.email});
    if(!user)
        return res.status(400).send("Invalid email or Password");

    let validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword)
        return res.status(400).send('Invalid email or Password');
    
    res.send(true);         
});

function validateUser(user){
    var Schema = Joi.object({
        email : Joi.string().email().min(1).max(100).required(),
        password : Joi.string().min(1).max(1024).required(),
    });
    return Schema.validate(user);
}

module.exports = router;