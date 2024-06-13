const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('<< connected to mongodb >>');

    }).catch((err) => {
        console.log(err);

    });

// models
const Product = require('./models/product');

const seedProducts = [
    {
		"name": "Kemeja Flanel",
		"brand": "Hollister",
		"price": 750000,
		"color": "biru muda",
		"size": "S"
	},
	{
		"name": "Celana Chino",
		"brand": "Levi's",
		"price": 900000,
		"color": "krem",
		"size": "XL"
	},
	{
		"name": "Sweater",
		"brand": "Gap",
		"price": 650000,
		"color": "merah muda",
		"size": "L"
	},
	{
		"name": "Tas Ransel",
		"brand": "Herschel",
		"price": 1500000,
		"color": "biru",
		"size": "M"
	},
	{
		"name": "Kacamata Aviator",
		"brand": "Ray-Ban",
		"price": 2000000,
		"color": "emas",
		"size": "S"
	},
	{
		"name": "Baju Renang",
		"brand": "Speedo",
		"price": 500000,
		"color": "biru tua",
		"size": "XL"
	},
	{
		"name": "Topi Baseball",
		"brand": "New Era",
		"price": 350000,
		"color": "hitam",
		"size": "M"
	},
	{
		"name": "Rompi",
		"brand": "Zara",
		"price": 850000,
		"color": "abu-abu",
		"size": "L"
	},
	{
		"name": "Jas",
		"brand": "Hugo Boss",
		"price": 4500000,
		"color": "hitam",
		"size": "S"
    }
	
]

Product.insertMany(seedProducts)
    .then((result) => {
        console.log(result);

    }).catch((err) => {
        console.log(err);

    });