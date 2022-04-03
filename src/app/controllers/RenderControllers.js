const {User, Role, Department, Submission, Category, Idea, Comment, File} = require('../models')
const _ = require('lodash')
class RenderControllers {

    // [GET] /user-management?page={}&limit={}
    async crudUser(req, res, next) {
        try {
            const limitAsNumber = parseInt(req.query.limit)
            const pageAsNumber = parseInt(req.query.page)

            let page = 1
            if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
                page = pageAsNumber;
            }

            let limit = 10
            if (!Number.isNaN(limitAsNumber) && !(limitAsNumber > 10) && !(limitAsNumber < 1)) {
                limit = limitAsNumber;
            }

            const users = await User.find().populate('role').populate('department').skip((limit * page) - limit).limit(limit)
            const count = users.length
            res.status(200).render('accounts/showList', {
                layout: 'layouts/dashboard', users, current: page, pages: Math.ceil(count / limit),
            })
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /user-register
    async registerUser(req, res, next) {
        try {
            const roles = await Role.find()
            const departments = await Department.find()
            res.status(200).render('accounts/register', {layout: 'layouts/dashboard', roles, departments})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /user-update/:id
    async updateUser(req, res, next) {
        try {
            const userId = req.params.id 
            const users = await User.findById(userId)
            const roles = await Role.find()
            const departments = await Department.find()
            res.status(200).render('accounts/update', {
                layout: 'layouts/dashboard', users, roles, departments
            })
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }
    
    // [GET] /category-management
    async crudCategory(req, res, next) {
        try {
            const categories = await Category.find()
            res.status(200).render('category/showList', {layout: 'layouts/dashboard', categories})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /department-register
    async registerDepartment(req, res, next) {
        try {
            res.status(200).render('department/register', {layout: 'layouts/forum'})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /department-update
    async updateDepartment(req, res, next) {
        try {
            res.status(200).render('department/update', {layout: 'layouts/forum'})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /department-management
    async crudDepartment(req, res, next) {
        try {
            const departments = await Department.find()
            res.status(200).render('department/showList', {layout: 'layouts/forum', departments})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    //TODO: REPORT
    // [GET] /report
    async chartData(req, res, next) {
        try {
            const department = await Department.find()
            const departLabels = department.map(obj => obj.name)
            const departId = department.map(obj => String(obj._id))
            
            let contributors = []
            for(const obj of departId) {
                const users = await User.find({department: obj})
                const numberContributors = users.length
                contributors.push(numberContributors)
            }

            const labels = String(departLabels)
            const data = String(contributors)
            res.status(200).render('report/index', {layout: 'layouts/dashboard', labels, data})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    //TODO
    // [GET] /all-submissions
    async showForum(req, res, next) {
        try {
            const submissions = await Submission.find().populate('user')
            res.status(200).render('forum/showSubmission', {layout: 'layouts/forum', submissions})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    //TODO
    // [GET] /all-ideas/:id
    async showAllIdeas(req, res, next) {
        try {
            const limitAsNumber = parseInt(req.query.limit)
            const pageAsNumber = parseInt(req.query.page)

            let page = 1
            if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
                page = pageAsNumber;
            }

            let limit = 5
            if (!Number.isNaN(limitAsNumber) && !(limitAsNumber > 10) && !(limitAsNumber < 1)) {
                limit = limitAsNumber;
            }

            const submissionId = req.params.id
            const ideas = await Idea.find({submission: submissionId}).skip((limit * page) - limit).limit(limit)
            const count = ideas.length
            res.status(200).render('forum/ideas', {layout: 'layouts/forum', ideas, submissionId, current: page, pages: Math.ceil(count / limit)})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    //TODO
    // [GET] /idea/:id/detail
    async showDetailIdea(req, res, next) {
        try {
            const ideaId = req.params.id
            const idea = await Idea.findById(ideaId).populate('user')
            const file = await File.findOne({idea: ideaId})
            const comments = await Comment.find({idea: ideaId}).populate('user')
            res.status(200).render('forum/ideaDetail', {layout: 'layouts/forum', idea, comments, file})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /idea-register
    async registerIdea(req, res, next) {
        try {
            const submissions = await Submission.find()
            const categories = await Category.find()
            res.status(200).render('idea/register', {layout: 'layouts/forum', categories, submissions})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /idea-management
    async crudIdea(req, res, next) {
        try {
            const ideas = await Idea.find().populate('submission')
            res.status(200).render('idea/showList', {layout: 'layouts/forum', ideas})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    //TODO
    // [GET] /idea-update/:id
    async updateIdea(req, res, next) {
        try {
            const ideaId = req.params.id
            const idea = await Idea.findById(ideaId)
            const submissions = await Submission.find()
            const categories = await Category.find()
            res.status(200).render('idea/detail', {layout: 'layouts/forum', idea, submissions, categories})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /submission-management?page{}&limit={}
    async crudSubmission(req, res, next) {
        try {
            const limitAsNumber = parseInt(req.query.limit)
            const pageAsNumber = parseInt(req.query.page)

            let page = 1
            if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
                page = pageAsNumber;
            }

            let limit = 10
            if (!Number.isNaN(limitAsNumber) && !(limitAsNumber > 10) && !(limitAsNumber < 1)) {
                limit = limitAsNumber;
            }

            const submissions = await Submission.find().populate('folder').skip((limit * page) - limit).limit(limit)
            const count = submissions.length
            res.status(200).render('submission/showList', {
                layout: 'layouts/dashboard', submissions, current: page, pages: Math.ceil(count / limit),
            })
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /submission-register
    async registerSubmission(req, res, next) {
        try {
            res.status(200).render('submission/register', {layout: 'layouts/dashboard'})
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    // [GET] /submission-update
    async updateSubmission(req, res, next) {
        try {
            const submissionId = req.params.id 
            const submissions = await Submission.findById(submissionId)
            res.status(200).render('submission/update', {
                layout: 'layouts/dashboard', submissions
            })
        } catch (error) {
            res.status(500).render('status/500', {layout: false})
        }
    }

    //~ [GET] /test
    async test(req, res, next) {
        try {
            const arrayCategories = [
                '624484188625d71a055bbf2d', 
                '6245049f526504896d5af41d',
                '624ee438d53c1f13bb11ca9c'
            ]
            const categories = await Category.find().select('_id')
            for(const element of categories) {
                const cateId = String(element._id)
                if(_.includes(arrayCategories, cateId) === true) {
                    const category = await Category.findById(cateId)
                    if(category.use === '') {
                        await Category.findByIdAndUpdate(cateId, {use: '1'})
                    } else {
                        let useNumber = parseInt(category.use)
                        const updateUseNumber = useNumber + 1
                        await Category.findByIdAndUpdate(cateId, {use: updateUseNumber})
                    }
                }
            }
            const updatedCategories = await Category.find()
            console.log(updatedCategories);
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new RenderControllers