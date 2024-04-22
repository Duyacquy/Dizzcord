const mongoose = require('mongoose')

async function connect() {

    try {
        await mongoose.connect('mongodb://localhost:27017/Dizzcord', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Đã kết nối với Database')
    } catch (error) {
        console.log('Chưa kết nối được')
    }
}

module.exports = { connect }