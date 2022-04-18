const {Schema, model} = require('mongoose')

const ViewSchema = new Schema({

    idea: {type: Schema.Types.ObjectId, required: true, ref: 'Idea'},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'}

}, {timestamps: true}
)

module.exports = model('View', ViewSchema, 'view')
