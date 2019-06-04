const mongoose = require('mongoose')

module.exports = {
    userSchema: new mongoose.Schema({
        first: String,
        last: String,
        email: String,
        admin: Boolean
    })
}