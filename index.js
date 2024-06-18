const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const ErrorHandler = require('./ErrorHandler');

// models
const Product = require('./models/product');
const Garment = require('./models/garment');

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('<< connected to mongodb >>');

    }).catch((err) => {
        console.log(err);

    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(err => next(err));
    }
}

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// === garment ===
app.get('/garments', wrapAsync(async (req, res) => {
    const garments = await Garment.find();
    res.render('garment/index', { garments });
}));

app.get('/garments/create', (req, res) => {
    res.render('garment/create');
});

app.post('/garments', wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    res.redirect(`/garments/`);
}));



// === products ===
app.get('/products', async (req, res) => {
    const { category } = req.query;
    
    if(category){
        const products = await Product.find({ category });
        res.render('products/index', { products, category });

    } else {
        const products = await Product.find();
        res.render('products/index', { products, category: 'All' });

    }
});

app.get('/products/create', (req, res) => {
    // throw new ErrorHandler('This is a custom error', 503);
    res.render('products/create');
});

app.post('/products', wrapAsync(async (req, res) => {
    console.log(req.body);
    const product = new Product(req.body);
    await product.save();
    res.redirect(`products/${product._id}`);
}));

// argument next ditambahin supaya bisa ngejalanin err handler
app.get('/products/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });

}));

app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });

}));

app.put('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`${product._id}`);
    
}));

app.delete('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Product.findByIdAndDelete( id );
    res.redirect('/products');
        
}));

app.use((err, req, res, next) => {
    // console.dir(err); // buat mastiin erornya apa
    if(err.name === "ValidationError"){
        err.status = 400;
        err.message = Object.values(err.errors).map(err => err.message);
    }
    if(err.name === 'CastError'){
        err.status = 404;
        err.message = 'Product Not Found!';
        
    }
    next(err);
});

// middleware error handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong!' } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('<< Server is running on port http://127.0.0.1:3000 >>');
});