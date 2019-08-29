const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');


router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    // res.status(200).json({
    //     message: "GET request to products"
    // });
});

router.post('/', (req, res, next) => {
    // const product = {
    //     name : req.body.name,
    //     type : req.body.type
    // }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json(
                {
                    product: product,
                    message: "Product stored in DB"
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: err });
        });

});

router.get('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    console.log(id);
    // if (id == 'hash') {
    //     res.status(200).json({
    //         message: "# request",
    //         id: id
    //     });
    // }
    // else {
    //     res.status(200).json({
    //         message: "You entered an id without #",
    //         id: id
    //     });
    // }
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

router.patch('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    const updateOps = {};
    console.log(req.body);
    for (const op in req.body) {
        updateOps[op.propName] = op.value;
    }
    console.log(updateOps);
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(id);
            console.log(result);
            console.log("Updated");
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


router.delete('/:product_id', (req, res, next) => {
    id = req.params.product_id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log("Product deleted");
            res.status(200).json(result);
        })
        .catch(err => {
            console.log("Error in deleting product");
            res.status(500).json({
                error: err
            });
        });
    // res.status(200).json({
    //     message: "DELETE request",
    // });
});

module.exports = router;