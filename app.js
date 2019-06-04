const express = require('express')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const { User } = require('./db/models')
const app = express()

const connectToMongo = require('./conn')

app.use(bodyParser.json())

connectToMongo(function () {

        // if (process.env.NODE_ENV !== 'production') {
        //     User.deleteMany(err => {
        //         if (err) return console.error(err)
        //         const sampleUser = new User({
        //             first: "Mitch",
        //             last: "Cravens",
        //             email: "mcravens12@gmail.com",
        //             admin: true
        //         })
        //         sampleUser.save((err) => {
        //             if (err) return console.error(err)
        //         })
        //     })
            
        // }
    

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
        User.find({ _id: req.params.id }, (err, user) => {
            if (err) {
                console.error(err)
                return res.sendStatus(500)
            }
            if (user.length < 1) {
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
    const validateEditUser = [
        check('first').optional().isString(),
        check('last').optional().isString(),
        check('email').optional().isEmail(),
        check('admin').optional().isBoolean(),
    ]
    // update user
    app.patch('/api/users/:id', validateEditUser, (req, res) => {
        const bodyKeys = Object.keys(req.body)
        if (!bodyKeys.length || bodyKeys.length > validateEditUser.length) {
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
        console.log('ass')
        // User.find({ email: req.body.email }, (err, user) => {
        //     if (err) {
        //         console.error(err)
        //         return res.sendStatus(500)
        //     }
        //     if (user.length) {
        //         return res.sendStatus(409)
        //     }
        //     const newUser = new User(req.body)
        //     newUser.save((err, user) => {
        //         if (err) {
        //             console.error(err)
        //             return res.sendStatus(500)
        //         }
        //         return res.json(user)
        //     })
        // })
    })

    app.delete('/api/users/:id', (req, res) => {
        knex('users')
            .where('id', req.params.id)
            .del()
            .then(() => {
                res.send('User deleted.')
            })
            .catch(e => {
                console.error(e)
                res.sendStatus(500)
            })
    })




    app.listen(process.env.PORT || 3000)
})





