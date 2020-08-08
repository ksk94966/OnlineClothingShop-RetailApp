const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const {User,validateUser} = require('../models/user');

router.post('/',async (req,res,next)=>{

    const result = await validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let user = await User.findOne({email : req.body.email});
    if(user)
        return res.status(400).send("User Already Registered...!");
    user = new User({
        email : req.body.email,
        name : req.body.name,
        password : req.body.password
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await  bcrypt.hash(user.password,salt);
    const savedUser = await user.save();
    res.send(_.pick(savedUser,['_id','name','email']));         
});

module.exports = router;