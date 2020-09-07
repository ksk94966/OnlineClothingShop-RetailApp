const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const isLoggedIn = require('../middleware/isLoggedIn');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const sizes = require('../util/sizes');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, path.join(path.resolve(__dirname, '..'), '/public/images'));
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    }
});

const upload = multer({storage:storage});

const {Item} = require('../models/item');
const {validateItem} = require('../models/item');

router.get('/',async (req, res, next)=> {

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
    
    var perPage = 3;
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

router.get('/add',admin,(req,res,next)=>{

    res.render('add');
})

router.post('/',upload.single('pic'),async (req,res,next)=>{

    // const result = validateItem(req.body);
    // console.log(req.body);
    // if(result.error){
    //     console.log(result.error.details[0].message);
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    //console.log(req.file);
    //console.log(req.body);
    var item = new Item({

        itemname : req.body.itemname,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        sizes : {},
        imagePath : req.file ? req.file.filename : item.imagePath ? item.imagePath : 'default.jpg'
        
    })

    for (var size of sizes) {
        console.log(size);
        console.log(req.body[size]);
        item.sizes[size] = req.body[size] ? req.body[size] : 1;
    }
    const savedItem = await item.save();
    res.redirect('/view/' + savedItem._id);
});

router.put('/:id',upload.single('pic'),async (req,res,next)=>{

    var item = await Item.findById(req.params.id);
    
    //console.log(req.body);
    console.log("Sai Krishna");
    
    item.itemname = req.body.itemname;
    item.description = req.body.description;
    item.price = req.body.price;
    item.category = req.body.category;
    //console.log(req.file);
    item.imagePath = req.file ? req.file.filename : (item.imagePath ? item.imagePath : 'default.jpg');
    
    for (var size of sizes) {
        console.log(size);
        console.log(req.body[size]);
        item.sizes[size] = req.body[size] ? req.body[size] : 1;
    }

    const savedItem = await item.save();
    res.redirect('/view/' + savedItem._id);
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