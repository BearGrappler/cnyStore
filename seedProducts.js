/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var Product = db.model('product');
var Promise = require('sequelize').Promise;

var seedProducts = function () {

    var products = [
        {
            name: 'Macbook Silver',
            manufacturer: 'Apple',
            msrp: 800.00,
            price: 999.99,
            description: 'stylish laptop for college students',
            imageUrls: ['http://store.storeimages.cdn-apple.com/4973/as-images.apple.com/is/image/AppleInc/aos/published/images/m/ac/macbook/air/macbook-air-13-select-hero-201505?wid=265&hei=154&fmt=png-alpha&qlt=95&.v=YGXjP3','http://store.storeimages.cdn-apple.com/4973/as-images.apple.com/is/image/AppleInc/aos/published/images/m/ac/macbookair/select/macbookair-select-box-201504?wid=553&hei=399&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=HWal10'
            ],
            type: 'base'
        },
        {
            name: 'Alienware Gaming Laptop',
            manufacturer: 'Dell',
            msrp: 900.00,
            price: 1199.99,
            description: 'gaming device for intense mountain-dew guzzlers',
            imageUrls: ['http://scene7-cdn.dell.com/is/image/DellComputer/laptop-alienware-15-r2-polaris-mixed-set-video?hei=400&wid=965','http://shop-media.intel.com/api/v2/helperservice/getimage?url=http://images.icecat.biz/img/gallery/29798850_5705.jpg&height=550&width=550'
            ],
            type: 'base'
        },
        {
            name: 'Thinkpad',
            manufacturer: 'Lenovo',
            msrp: 800.00,
            price: 1099.99,
            description: 'ergonomic no-frills office productivity device',
            imageUrls: ['http://www.lenovo.com/shop/americas/content/img_lib/subseries/T460-hero.png'
            ],
            type: 'base'
        },
        {
            name: 'Spectre',
            manufacturer: 'HP',
            msrp: 1100.00,
            price: 1300.99,
            description: 'Someone call Guinness! HP’s new luxurious Spectre 13.3 ultraportable could now be the thinnest laptop in the world.',
            imageUrls: ['http://core2.staticworld.net/images/article/2016/04/hp_spectre_13.3-100654198-large.jpg'
            ],
            type: 'base'
        },

        // RAM Components
        {
            name: 'Vengeance 4GB (2 x 2GB)',
            manufacturer: 'Corsair',
            msrp: 22.99,
            price: 18.99,
            description: `DDR3 1600 (PC3 12800),
                Timing 9-9-9-24,
                Cas Latency 9,
                Voltage 1.5V`,
            imageUrls: ['http://pisces.bbystatic.com/image2/BestBuy_US/images/products/3027/3027187_sa.jpg;maxHeight=1000;maxWidth=1000'],
            type: 'ram'
        },
        {
            name: 'Vengeance 4GB (1 x 4GB)',
            manufacturer: 'Corsair',
            msrp: 24.99,
            price: 21.99,
            description: `DDR3 1600 (PC3 12800),
                Timing 9-9-9-24,
                Cas Latency 9,
                Voltage 1.5V`,
            imageUrls: ['http://pisces.bbystatic.com/image2/BestBuy_US/images/products/3027/3027187_sa.jpg;maxHeight=1000;maxWidth=1000'],
            type: 'ram'
        },
        {
            name: 'Vengeance 8GB (2 x 4GB)',
            manufacturer: 'Corsair',
            msrp: 42.99,
            price: 38.99,
            description: `DDR3 1600 (PC3 12800),
                Timing 9-9-9-24,
                Cas Latency 9,
                Voltage 1.5V`,
            imageUrls: ['http://pisces.bbystatic.com/image2/BestBuy_US/images/products/3027/3027187_sa.jpg;maxHeight=1000;maxWidth=1000'],
            type: 'ram'
        },
        {
            name: 'Vengeance 8GB (2 x 4GB)',
            manufacturer: 'Corsair',
            msrp: 48.99,
            price: 46.99,
            description: `DDR3 1600 (PC3 12800),
                Timing 9-9-9-24,
                Cas Latency 9,
                Voltage 1.5V`,
            imageUrls: ['http://pisces.bbystatic.com/image2/BestBuy_US/images/products/3027/3027187_sa.jpg;maxHeight=1000;maxWidth=1000'],
            type: 'ram'
        },
        {
            name: 'Vengeance 16GB (4 x 4GB)',
            manufacturer: 'Corsair',
            msrp: 68.99,
            price: 64.99,
            description: `DDR3 1600 (PC3 12800),
                Timing 9-9-9-24,
                Cas Latency 9,
                Voltage 1.5V`,
            imageUrls: ['http://pisces.bbystatic.com/image2/BestBuy_US/images/products/3027/3027187_sa.jpg;maxHeight=1000;maxWidth=1000'],
            type: 'ram'
        },
        {
            name: 'Vengeance 16GB (2 x 8GB)',
            manufacturer: 'Corsair',
            msrp: 88.99,
            price: 86.99,
            description: `DDR3 1600 (PC3 12800),
                Timing 9-9-9-24,
                Cas Latency 9,
                Voltage 1.5V`,
            imageUrls: ['http://pisces.bbystatic.com/image2/BestBuy_US/images/products/3027/3027187_sa.jpg;maxHeight=1000;maxWidth=1000'],
            type: 'ram'
        },

        // CPU components
        {
            name: 'Core i3',
            manufacturer: 'Intel',
            msrp: 249.99,
            price: 234.99,
            description: `LGA 1151,
                Unlocked Processor, 
                DDR4 & DDR3L Support, 
                Display Resolution up to 4096 x 2304, 
                Intel Turbo Boost Technology, 
                Compatible with Intel 100 Series Chipset Motherboards`,
            imageUrls: ['http://images17.newegg.com/is/image/newegg/19-117-561-TS?$S640$'],
            type: 'cpu'
        },
        {
            name: 'Core i5',
            manufacturer: 'Intel',
            msrp: 249.99,
            price: 234.99,
            description: `LGA 1151,
                Unlocked Processor, 
                DDR4 & DDR3L Support, 
                Display Resolution up to 4096 x 2304, 
                Intel Turbo Boost Technology, 
                Compatible with Intel 100 Series Chipset Motherboards`,
            imageUrls: ['http://images17.newegg.com/is/image/newegg/19-117-561-TS?$S640$'],
            type: 'cpu'
        },
        {
            name: 'Core i7',
            manufacturer: 'Intel',
            msrp: 349.99,
            price: 334.99,
            description: `LGA 1151,
                Unlocked Processor, 
                DDR4 & DDR3L Support, 
                Display Resolution up to 4096 x 2304, 
                Intel Turbo Boost Technology, 
                Compatible with Intel 100 Series Chipset Motherboards`,
            imageUrls: ['http://images17.newegg.com/is/image/newegg/19-117-561-TS?$S640$'],
            type: 'cpu'
        },
        {
            name: 'Core i9',
            manufacturer: 'Intel',
            msrp: 449.99,
            price: 434.99,
            description: `LGA 1151,
                Unlocked Processor, 
                DDR4 & DDR3L Support, 
                Display Resolution up to 4096 x 2304, 
                Intel Turbo Boost Technology, 
                Compatible with Intel 100 Series Chipset Motherboards`,
            imageUrls: ['http://images17.newegg.com/is/image/newegg/19-117-561-TS?$S640$'],
            type: 'cpu'
        },
        {
            name: 'Core i11',
            manufacturer: 'Intel',
            msrp: 449.99,
            price: 434.99,
            description: `LGA 1151,
                Unlocked Processor, 
                DDR4 & DDR3L Support, 
                Display Resolution up to 4096 x 2304, 
                Intel Turbo Boost Technology, 
                Compatible with Intel 100 Series Chipset Motherboards`,
            imageUrls: ['http://images17.newegg.com/is/image/newegg/19-117-561-TS?$S640$'],
            type: 'cpu'
        },

        // HDD components
        {
            name: '850 EVO 250GB',
            manufacturer: 'Samsung',
            msrp: 169.99,
            price: 157.99,
            description: "Achieve the ultimate read/write performance to maximize your everyday computing experience with Samsung's TurboWrite technology. You only obtain a 10% better user.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRSGrFH-UGa1tkzURSkIvRms_QOOkbY3-dfTMgeW4OP4DfmxEZuahnqbpAIF40lqCR3mJ4jmos&usqp=CAE'],
            type: 'hdd'
        },
        {
            name: '850 EVO 500GB',
            manufacturer: 'Samsung',
            msrp: 269.99,
            price: 257.99,
            description: "Achieve the ultimate read/write performance to maximize your everyday computing experience with Samsung's TurboWrite technology. You only obtain a 10% better user.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRSGrFH-UGa1tkzURSkIvRms_QOOkbY3-dfTMgeW4OP4DfmxEZuahnqbpAIF40lqCR3mJ4jmos&usqp=CAE'],
            type: 'hdd'
        },
        {
            name: '850 EVO 750GB',
            manufacturer: 'Samsung',
            msrp: 369.99,
            price: 357.99,
            description: "Achieve the ultimate read/write performance to maximize your everyday computing experience with Samsung's TurboWrite technology. You only obtain a 10% better user.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRSGrFH-UGa1tkzURSkIvRms_QOOkbY3-dfTMgeW4OP4DfmxEZuahnqbpAIF40lqCR3mJ4jmos&usqp=CAE'],
            type: 'hdd'
        },
        {
            name: '850 EVO 1TB',
            manufacturer: 'Samsung',
            msrp: 469.99,
            price: 457.99,
            description: "Achieve the ultimate read/write performance to maximize your everyday computing experience with Samsung's TurboWrite technology. You only obtain a 10% better user.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRSGrFH-UGa1tkzURSkIvRms_QOOkbY3-dfTMgeW4OP4DfmxEZuahnqbpAIF40lqCR3mJ4jmos&usqp=CAE'],
            type: 'hdd'
        },

        // GPU components
        {
            name: 'GeForce GTX 730 Graphics Card',
            manufacturer: 'EVGA',
            msrp: 69.99,
            price: 57.99,
            description: "Speed up your PC experience when you upgrade from integrated graphics to the NVIDIA GeForce GT 730 dedicated card.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAnfjGLF0RmAE7j8dE64AD7LJMeI5f8pX43UCIuPuE2KugBQ8&usqp=CAE'],
            type: 'gpu'
        },
        {
            name: 'GeForce GTX 980 Graphics Card',
            manufacturer: 'EVGA',
            msrp: 369.99,
            price: 357.99,
            description: "Speed up your PC experience when you upgrade from integrated graphics to the NVIDIA GeForce GT 730 dedicated card.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAnfjGLF0RmAE7j8dE64AD7LJMeI5f8pX43UCIuPuE2KugBQ8&usqp=CAE'],
            type: 'gpu'
        },
        {
            name: 'GeForce GTX 960 Graphics Card',
            manufacturer: 'EVGA',
            msrp: 269.99,
            price: 257.99,
            description: "Speed up your PC experience when you upgrade from integrated graphics to the NVIDIA GeForce GT 730 dedicated card.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAnfjGLF0RmAE7j8dE64AD7LJMeI5f8pX43UCIuPuE2KugBQ8&usqp=CAE'],
            type: 'gpu'
        },
        {
            name: 'GeForce GTX 970 Graphics Card',
            manufacturer: 'EVGA',
            msrp: 169.99,
            price: 157.99,
            description: "Speed up your PC experience when you upgrade from integrated graphics to the NVIDIA GeForce GT 730 dedicated card.",
            imageUrls: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSAnfjGLF0RmAE7j8dE64AD7LJMeI5f8pX43UCIuPuE2KugBQ8&usqp=CAE'],
            type: 'gpu'
        }

    ];

    var creatingProducts = products.map(function (productObj) {
        return Product.create(productObj);
    });

    return Promise.all(creatingProducts);

};

db.sync({ force: true })
    .then(function () {
        return seedProducts();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
