const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Garment = require('../models/garment')
const wrapAsync = require('../WrapAsync');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('<< connected to mongodb >>');

    }).catch((err) => {
        console.log(err);

    });

router.get('/', wrapAsync(async (req, res) => {
    const garments = await Garment.find();
    res.render('garments/index', { garments });
}));

router.get('/create', (req, res) => {
    res.render('garments/create');
});

router.post('/', wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    res.redirect(`/garments`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const garment = await Garment.findById(req.params.id).populate('products'); //jgn lupa populate()
    res.render('garments/show', { garment });
}));

// --- create a product (child) inside a garment (parent) ---
// garments/:id_garment/products/create

// --- Edit a product (child) inside a garment (parent) ---
// garments/:id_garment/products/:id_product/edit

// show some products inside a garment
// garments/:id_garment/products/

// show a product inside a garment
// garments/:id_garment/products/:id_products

router.get('/:garment_id/products/create', (req, res) => {
    const { garment_id } = req.params;
    res.render('products/create', { garment_id });
});

router.post('/:garment_id/products', wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);
    
    garment.products.push(product);
    product.garment = garment;

    await garment.save();
    await product.save();
    res.redirect(`/garments/${garment_id}`);

    console.log(garment);
    console.log(product);
}));

router.delete('/:garment_id', wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    await Garment.findOneAndDelete({ _id: garment_id });
    res.redirect('/garments');
}));

module.exports = router;