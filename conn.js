const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/forum', {
    useNewUrlParser: true
})

module.exports = cb => {
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
       cb()
    });
}

