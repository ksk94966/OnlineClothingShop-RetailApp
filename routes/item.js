const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const {Item} = require('../models/item');
const {validateItem} = require('../models/item');

router.get('/',async (req,res)=>{

    const items = await Item.find();
    res.render('index',{items : items});
});

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

module.exports = router;