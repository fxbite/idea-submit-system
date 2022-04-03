const {Schema, model} = require('mongoose')

const ReactionSchema = new Schema({

    idea: {type: Schema.Types.ObjectId, required: true, ref: 'Idea'},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    icon: {type: Schema.Types.ObjectId, required: true, ref: 'Icon'}

}, {timestamps: true}
)

module.exports = model('Reaction', ReactionSchema, 'reaction')
