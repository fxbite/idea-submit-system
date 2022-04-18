const {Schema, model} = require('mongoose')

const FileSchema = new Schema({

    file_id_drive: {type: String, required: true},
    file_path: {type: String, required: true},
    file_name: {type: String, required: true},
    idea: {type: Schema.Types.ObjectId, required: true, ref: 'Idea'},
    folder : {type: Schema.Types.ObjectId, required: true, ref: 'Folder'}

}, {timestamps: true}
)

module.exports = model('File', FileSchema, 'file')


