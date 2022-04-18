const {Schema, model} = require('mongoose')

const DepartmentSchema = new Schema({

    name: {type: String, required: true},

}, {timestamps: true}
)

module.exports = model('Department', DepartmentSchema, 'department')
