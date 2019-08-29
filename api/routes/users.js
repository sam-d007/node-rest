const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const User = require('../models/users');

router.post('/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "User already exists with the provided email"
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(409).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json(
                                    {
                                        message: "User Created!",
                                        user: result
                                    }
                                )
                            })
                            .catch(err => {
                                res.status(400).json({ message: "user could not be created" });
                            });
                    }
                });
            }
        });


});

module.exports = router;