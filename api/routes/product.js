const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "GET request to products"
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name : req.body.name,
        type : req.body.type
    }
    res.status(201).json({
        message: "POST request to products",
        product : product
    });
});

router.get('/:product_id', (req, res, next) => {
    const id = req.params.product_id;
    console.log(id);
    if (id == 'hash') {
        res.status(200).json({
            message: "# request",
            id : id
        });
    }
    else {
        res.status(200).json({
            message : "You entered an id without #",
            id : id
        });
    }
});

router.patch('/:product_id', (req, res, next) => {
        res.status(200).json({
            message: "UPDATE request",
        });
});


router.delete('/:product_id', (req, res, next) => {
    res.status(200).json({
        message: "DELETE request",
    });
});

module.exports = router;