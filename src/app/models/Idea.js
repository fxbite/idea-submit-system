const {Schema, model} = require('mongoose')

const IdeaSchema = new Schema({

    title: {type: String, required: true},
    description: {type: String, required: true, default: ""},
    content: {type: String, required: true},
    anonymousMode: {type: Boolean, default: false},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    submission: {type: Schema.Types.ObjectId, required: true, ref: 'Submission'},
    category: [{type: Schema.Types.ObjectId, required: true, ref: 'Category'}],
    total_view: {type: String, default: ""},
    total_reaction: {type: String, default: ""}

}, {timestamps: true}
)

module.exports = model('Idea', IdeaSchema, 'idea')
