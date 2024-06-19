const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const ErrorHandler = require('./ErrorHandler');
const wrapAsync = require('./WrapAsync');

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
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());


app.get('/', (req, res) => {
    res.render('index');
});


// define routes
app.use('/products', require('./routes/products'));
app.use('/garments', require('./routes/garments'));

app.use((err, req, res, next) => {
    console.dir(err); // buat mastiin erornya apa
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