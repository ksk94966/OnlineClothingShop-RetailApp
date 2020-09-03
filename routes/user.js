const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const {User,validateUser} = require('../models/user');

router.post('/',async (req,res)=>{

    const result = await validateUser(req.body);
    if(result.error){
        res.status(400).render('signup',{'message': result.error.details[0].message});
        return;
    }

    let user = await User.findOne({email : req.body.email});
    if(user)
        return res.status(400).render('signup',{'message': "User Already Registered...!"});
    user = new User({
        email : req.body.email,
        name : req.body.name,
        password : req.body.password
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await  bcrypt.hash(user.password,salt);
    const savedUser = await user.save();
    const token = await jwt.sign({_id : user._id,isAdmin : user.isAdmin},config.get('jwtPrivateKey'));
    res.cookie('x-auth-token',token,{ maxAge: 900000, httpOnly: false }).redirect('/item');
});

module.exports = router;