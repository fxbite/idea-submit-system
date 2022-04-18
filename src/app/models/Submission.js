const {Schema, model} = require('mongoose')

const SubmissionSchema = new Schema({

    name: {type: String, required: true},
    description: {type: String, required: true},
    closure_date: {type: Date, required: true},
    final_closure_date: {type: Date, required: true},
    folder: {type: Schema.Types.ObjectId, ref: 'Folder'},
    user: {type: Schema.Types.ObjectId, ref: 'User'}

}, {timestamps: true}
)

module.exports = model('Submission', SubmissionSchema, 'submission')
