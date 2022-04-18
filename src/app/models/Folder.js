const {Schema, model} = require('mongoose')

const FolderSchema = new Schema({

    folder_id_drive: {type: String, required: true},
    folder_path: {type: String, required: true}

}, {timestamps: true}
)

module.exports = model('Folder', FolderSchema, 'folder')
