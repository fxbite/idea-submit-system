
const {Submission, Folder} = require('../models')
const googleDrive = require('../../util/drive')

class SubmissionController {

    // [POST] /submission
    async createSubmission(req, res, next) {
        const session = await Submission.startSession();
        session.startTransaction();
        try {
            const nameSubmission = req.body.name

            // Create a folder for submission
            const folderResult = await googleDrive.createFolder(nameSubmission)
            const folderIdDrive = folderResult.id 

            // Generate public path of folder
            const generateResult = await googleDrive.generatePublicUrl(folderIdDrive)
            const publicFolder = generateResult.webViewLink

            // Save folder info into db
            const newFolder = new Folder({
                folder_id_drive: folderIdDrive,
                folder_path: publicFolder
            })
            const savedFolder = await newFolder.save({session})
            const folderId = savedFolder._id

            // Save submission
            const newSubmission = new Submission({
                name: nameSubmission,
                description: req.body.description,
                closure_date: req.body.closure_date,
                final_closure_date: req.body.final_closure_date,
                folder: folderId,
                user: req.body.user
            })
            const savedSubmission = await newSubmission.save({session})
            await session.commitTransaction();
            session.endSession();
            return res.redirect('/submission-management')

        } catch (error) {
            await session.abortTransaction();
            res.status(500).json(error)
        } 
    }

    // [PATCH] /submission/:id
    async updateSubmission(req, res, next){
        
        try {
            const id = req.params.id
            const cld = req.body.closure_date
            const fcld = req.body.final_closure_date
            const submission = await Submission.findById(id)
            let inputData = {
                name: req.body.name,
                description: req.body.description
            }
            if(cld !== '') {
                inputData.closure_date = req.body.closure_date
            } 

            if(fcld !== '') {
                inputData.final_closure_date = req.body.final_closure_date
            }

            await submission.updateOne({ $set: inputData})
            const submissionUpdated = await Submission.findById(id)
            res.redirect('/submission-management')

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [DELETE] /submission/:id
    async deleteSubmission(req, res, next){
        const session = await Submission.startSession();
        session.startTransaction();
        try {
            const submissionId = req.params.id
            const submission = await Submission.findById(submissionId)
            const folderId = submission.folder
            await submission.deleteOne({session})

            // Get folder id 
            const folder = await Folder.findById(folderId)
            const folderIdDrive = folder.folder_id_drive
            await folder.deleteOne({session})

            // Delete folder in Google Drive
            await googleDrive.deleteFile(folderIdDrive)
            await session.commitTransaction();
            session.endSession();
            res.redirect('/submission-management')

        } catch (error) {
            await session.abortTransaction();
            res.status(500).json(error)
        }
    }

    // [GET] /submissions
    async getAllSubmission(req, res, next){

        try {
            const submissions = await Submission.find({})
            res.status(200).json(submissions)

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /submission/:id
    async getASubmission(req, res, next) {

        try {
            const submission = await Submission.findById(req.params.id)
            res.status(200).json(submission)

        } catch (error) {
            res.status(500).json(error)
        }
    }

}

module.exports = new SubmissionController