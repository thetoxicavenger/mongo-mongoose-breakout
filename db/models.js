const mongoose = require('mongoose')
const { userSchema } = require('./schemas')

module.exports = {
    User: mongoose.model('User', userSchema)
}