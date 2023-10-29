const mongoose = require('mongoose');
const {Schema} = mongoose;


const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, index: true },
    password: String,
});


const UserModal = mongoose.model('User', UserSchema);

module.exports = UserModal;