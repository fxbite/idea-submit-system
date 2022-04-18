const Comment = require('../models/Comment')
const Idea = require('../models/Idea')
const User = require('../models/User')
const {Types} = require('mongoose')
const notificationMail = require('../../util/mail')
class CommentController {

    // [POST] /comment
    async createComment(req, res, next){

        try {
            const ideaId = req.body.idea
            const newComment = await Comment(req.body)
            const savedComment = await newComment.save()
            
            const idea = await Idea.findById(ideaId).populate('user')
            const emailAuthor = idea.user.email
            const fullNameAuthor = idea.user.fullname

            //? Send email notification to author of idea
            await notificationMail(fullNameAuthor, emailAuthor, 'idea')

            res.redirect(`/idea/${ideaId}/detail`)

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [PATCH] /comment/:id
    async updateComment(req, res, next){

        try {
            const userLoginId = req.session.userId

            const id = req.params.id
            const comment = await Comment.findById(id)
            const userId = String(comment.user)
            const ideaId = String(comment.idea)

            if(userLoginId === userId) {
                await comment.updateOne({
                    $set: {
                        content: req.body.content,
                        anonymousMode: req.body.anonymousMode
                    }
                })
                return res.redirect(`/idea/${ideaId}/detail`)
            }
            res.redirect(`/idea/${ideaId}/detail`)

        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [DELETE] /comment/:id
    async deleteComment(req, res, next){

        try {
            const userLoginId = req.session.userId

            const id = req.params.id
            const comment = await Comment.findById(id)
            const userId = String(comment.user)
            const ideaId = String(comment.idea)
            
            if(userLoginId === userId) {
                await comment.deleteOne()
                return res.redirect(`/idea/${ideaId}/detail`)
            }
            res.redirect(`/idea/${ideaId}/detail`)
            
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /comments
    async showAllComment(req, res, next){

        try {
            const commentLevel1 = await Comment.find({replierMode: false}).sort({_id:-1})
            res.status(200).json(commentLevel1)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /comment/:id
    async showAComment(req, res, next){

        try {
            const commentReply = await Comment.findById(req.params.id)
            res.status(200).json(commentReply)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new CommentController