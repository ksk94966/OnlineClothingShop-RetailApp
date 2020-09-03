const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const isLoggedIn = require('../middleware/isLoggedIn');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {Item} = require('../models/item');

router.get('/:id',async (req,res,next)=>{

    var item = await Item.findById(req.params.id);

    if(!item){
        res.status(404).send("Item Not Found");
    }

    res.render('view',{item : item});
});


module.exports = router;