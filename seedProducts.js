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
