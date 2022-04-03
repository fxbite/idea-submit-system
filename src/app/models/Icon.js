const {Schema, model} = require('mongoose')

const IconSchema = new Schema({

    name: {type: String, required: true}

}, {timestamps: true}
)

module.exports = model('Icon', IconSchema, 'icon')
