const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const wrapAsync = require('../WrapAsync');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('<< connected to mongodb >>');

    }).catch((err) => {
        console.log(err);

    });

router.get('/', async (req, res) => {
    const { category } = req.query;
    
    if(category){
        const products = await Product.find({ category });
        res.render('products/index', { products, category });

    } else {
        const products = await Product.find();
        res.render('products/index', { products, category: 'All' });

    }
});

router.get('/create', (req, res) => {
    // throw new ErrorHandler('This is a custom error', 503);
    res.render('products/create');
});

router.post('/', wrapAsync(async (req, res) => {
    console.log(req.body);
    const product = new Product(req.body);
    await product.save();
    res.redirect(`products/${product._id}`);
}));

// argument next ditambahin supaya bisa ngejalanin err handler
router.get('/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id).populate('garment');
    res.render('products/show', { product });

}));

router.get('/:id/edit', wrapAsync(async (req, res, next) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });

}));

router.put('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`${product._id}`);
    
}));

router.delete('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndDelete( id );
    res.redirect('/products');
        
}));

module.exports = router;