const express = require('express')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const { User } = require('./db/models')
const app = express()

const connectToMongo = require('./conn')

app.use(bodyParser.json())

connectToMongo(function () {

    // simple select all
    app.get('/api/users', (req, res) => {
        User.find((err, users) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            res.json(users)
        })
    })

    // select with where
    app.get('/api/users/:id', (req, res) => {
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            if (user === null) {
                return res.sendStatus(404)
            }
            res.json(user)
        })
    })

    const validateUser = [
        check('first').isString(),
        check('last').isString(),
        check('email').isEmail(),
        check('admin').isBoolean(),
    ]
    app.post('/api/users', validateUser, (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        User.find({ email: req.body.email }, (err, user) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            if (user.length) {
                return res.sendStatus(409)
            }
            const newUser = new User(req.body)
            newUser.save((err, user) => {
                if (err) {
                    console.error(err)
                    return res.sendStatus(500)
                }
                return res.json(user)
            })
        })
    })
  
    // update user
    app.put('/api/users/:id', validateUser, (req, res) => {
        const bodyKeys = Object.keys(req.body)
        if (req.params.id == undefined || bodyKeys.length !== validateUser.length) {
            return res.sendStatus(422)
        }
        for (let i = 0; i < bodyKeys.length; i++) {
            const key = bodyKeys[i]
            if (key !== 'first' && key !== 'last' && key !== 'email' && key !== 'admin') {
                return res.sendStatus(422)
            }
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        User.updateOne({ _id: req.params.id }, req.body, (err, numberAffected, rawResponse) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        })
    })

    app.delete('/api/users/:id', (req, res) => {
        if (req.params.id == undefined) {
            return res.sendStatus(422)
        }
        User.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            if (user === null) {
                return res.sendStatus(404)
            }
            User.deleteOne({ _id: req.params.id }, err => {
                if (err) {
                    console.error(err)
                    return res.sendStatus(500)
                }
                res.sendStatus(200)
            })
            
        })
    })




    app.listen(process.env.PORT || 3000)
})





