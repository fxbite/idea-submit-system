const {Schema, model} = require('mongoose')

const CommentSchema = new Schema({

    content: {type: String, required: true},
    anonymousMode: {type: Boolean, default: false},
    idea: {type: Schema.Types.ObjectId, required: true, ref: 'Idea'},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    comment: {type: String, default: ""},
    replierMode: {type: Boolean, default: false}

}, {timestamps: true}
)

module.exports = model('Comment', CommentSchema, 'comment')
