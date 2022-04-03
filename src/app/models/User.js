const {Schema, model} = require('mongoose')

const UserSchema = new Schema({

    username: {type: String, required: true, max: 10, unique: true},
    password: {type: String, required: true, min: 6},
    email: {type: String, required: true, max: 50, unique: true},
    fullname: {type: String, required: true},
    role: {type: Schema.Types.ObjectId, required: true, ref: 'Role'},
    department: {type: Schema.Types.ObjectId, required: true, ref: 'Department'}

}, {timestamps: true}
)

module.exports = model('User', UserSchema, 'user')
