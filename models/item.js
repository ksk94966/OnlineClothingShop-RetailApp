const mongoose = require('mongoose');
const Joi = require('joi');

const Item = mongoose.model('item',mongoose.Schema(
    {
        itemname : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        price : { type : Number , required : true},
        category : { type : String , required : true},
        sizes :{
            'S' : {type : Number, min : 1 ,max : 200 , default : 1},
            'M' : {type : Number, min : 1 ,max : 200 , default : 1},
            'L' : {type : Number, min : 1 ,max : 200 , default : 1},
            'XL' : {type : Number, min : 1 ,max : 200 , default : 1},
            'XXL' : {type : Number, min : 1 ,max : 200 , default : 1},
        },
        imagePath : {
            type : String,
            required : true
        }
    }
))

function validateItem(item){
    var Schema = Joi.object({
        itemname : Joi.string().min(1).max(50).required(),
        category : Joi.string().min(1).max(20).required(),
        price : Joi.number().min(1).max(50).required(),
        description : Joi.string().min(1).max(1000).required(),
        imagePath : Joi.string().min(1).max(1000).required(),
    });

    return Schema.validate(item);
}

module.exports.Item = Item;
module.exports.validateItem = validateItem;