const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name:{
        type: String,
    },
    avatar:{
        type: String,
    },
    banner:{
        type: String
    },
    description:{
        type: String,
    }
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;
