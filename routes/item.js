const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const isLoggedIn = require('../middleware/isLoggedIn');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {Item} = require('../models/item');
const {validateItem} = require('../models/item');

router.get('/',async function(req, res, next) {

    var clause = {};
    if(req.query.search){
        clause.itemname = new RegExp('.*' + validateString(req.query.search) + '.*', 'i');
        res.locals.search = req.query.search;
    }
    else{
        res.locals.search = "";
    }
    if(req.query.category){
        clause.category = new RegExp('.*' + validateString(req.query.category) + '.*', 'i');
        res.locals.category = req.query.category;
    }else{
        res.locals.category = "";
    }
    //console.log(clause);
    
    var perPage = 4;
    var page =  isNaN(req.query.page) ? 1 : Number(req.query.page);
 
    await Item
        .find(clause)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, items) {
            Item.count().exec(function(err, count) {
                if (err) return next(err)
                console.log(count);
                res.render('index', {
                    items: items,
                    current: page,
                    pages: Math.ceil(count / perPage),
                })
            })
        })
})

router.post('/',[auth,admin],async (req,res,next)=>{

    const result = validateItem(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const item = new Item({

        itemname : req.body.itemname,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        imagePath : req.body.imagePath
    })
    const savedItem = await item.save();
    res.send(savedItem);
});


router.put('/:id',async (req,res,next)=>{

    const result = validateItem(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    var item = await Item.findById(req.params.id);


    item.itemname = req.body.itemname;
    item.description = req.body.description;
    item.price =  req.body.price;
    item.category =  req.body.category;
    item.imagePath = req.body.imagePath;

    const savedItem = await item.save();
    res.send(savedItem);
});



router.delete("/:id",async (req,res)=>{
    const item = await Item.findByIdAndDelete(req.params.id);
    if(!item)
        console.log("Item with given id is not found");
    res.send(item);
})

function validateString(str){

    var result= str.replace(/[^\w]/g, '');
    return result;
}

module.exports = router;