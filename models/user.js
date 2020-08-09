const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('user',mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password : {type : String, required : true},
    isAdmin : {type : Boolean, default: false}
}));


function validateUser(user){
    var Schema = Joi.object({
        email : Joi.string().email().min(1).max(100).required(),
        name : Joi.string().min(1).max(100).required(),
        password : Joi.string().min(1).max(1024).required(),
    });

    return Schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;