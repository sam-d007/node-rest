const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
const config = require('../../config')[env];

const User = require('../models/users');

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.send(500).json(err)
        })
});
console.log(mongoose.connection.readyState);    

router.post('/signup', (req, res, next) => {
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

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ message: 'Not Authorized. Here' })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: 'Not Authenticated!' });
                }
                if (result) {
                    token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        config.jwt_key,
                        {
                            expiresIn: '1h'
                        }

                    );
                    return res.status(200).json(
                        {
                            message: 'Authenticated!',
                            token: token
                        });
                }
                return res.status(401).json({ message: err });
                // return res.status(403).json({ message: 'Not Authorised. Idhar' });
            });
        })
        .catch(err => {
            res.status(403).json({ message: 'Not Authorized. Error' })
        })
});

router.delete('/delete/:userEmail', (req, res, next) => {
    User.remove({ email: req.params.userEmail })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});


module.exports = router;