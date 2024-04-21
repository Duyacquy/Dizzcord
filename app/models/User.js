const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: {type: String},
    id : {type: String},
    avatar: {type: String},
    password: {type: String}, 
    status: {type: String}
})

module.exports = mongoose.model('User', User) 