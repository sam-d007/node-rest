const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "GET request to orders. Hello from nodemon"
    });
});

router.post('/', (req, res, next) => {
    const order = {
        name: req.body.name,
        type: req.body.type
    }
    res.status(201).json({
        message: "POST request to orders",
        order: order
    });
});

router.get('/:order_id', (req, res, next) => {
    res.status(200).json({
        message: "FEtech order details"
    });
});

router.post('/:order_id', (req, res, next) => {
    res.status(201).json({
        message: "Create order"
    });
});

module.exports = router;