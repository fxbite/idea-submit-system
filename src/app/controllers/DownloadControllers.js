const {Idea, Role, Submission, Category, Department, User} = require('../models')
const exportCSV = require('../../util/exportCSV')
const {parse, Parser} = require('json2csv')
const moment = require('moment')

class DownloadController {

    // [GET] /csv/download/:ideaId
    async csvDownload(req, res, next) {

        try {
            const ideas = await Idea.find()
                .populate('user')
                .populate('submission')

            let csv = [];
            for(const obj of ideas) {
                
                const role = await Role.findById(obj.user.role)
                const nameRole = role !== null ? role.name : ''

                const department = await User.findById(obj.user.department)
                const nameDepart = department !== null ? department.name : ''

                const submission = obj.submission !== null ? obj.submission : '' 

                const dataExported = {
                  ideaId: String(obj._id),
                  ideaTitle: obj.title,
                  ideaDescription: obj.description,
                  content: obj.content,
                  email: obj.user.email,
                  fullName: obj.user.fullname,
                  role: nameRole,
                  department: nameDepart,
                  title: submission.name,
                  description: submission.description,
                  closure_date: submission.closure_date,
                  final_closure_date: submission.final_closure_date,
                  totalViews: obj.total_view,
              };
              
              csv.push(dataExported)
            }

            const csvFields = [
                {
                    label: 'Idea ID',
                    value: 'ideaId',
                    default: ''
                },
                {
                    label: 'Idea Title',
                    value: 'ideaTitle',
                    default: ''
                },
                {
                    label: 'Idea Description',
                    value: 'ideaDescription',
                    default: ''
                },
                {
                    label: 'Idea Content',
                    value: 'content',
                    default: ''
                },
                {
                    label: 'Email',
                    value: 'email',
                    default: ''
                },
                {
                    label: 'Full Name',
                    value: 'fullName',
                    default: ''
                },
                {
                    label: 'Role',
                    value: 'role',
                    default: ''
                },
                {
                    label: 'Department',
                    value: 'department',
                    default: ''
                },
                {
                    label: 'Submission Title',
                    value: 'title',
                    default: ''
                },
                {
                    label: 'Submission Description',
                    value: 'description',
                    default: ''
                },
                {
                    label: 'Closure Date',
                    value: (value) => {
                        const format = value.closure_date !== undefined ? moment(value).format('YYYY-MM-DD HHmmss') : ''
                        return format
                    },
                    default: ''
                },
                {
                    label: 'Final Closure Date',
                    value: (value) => {
                        const format = value.final_closure_date !== undefined ? moment(value).format('YYYY-MM-DD HHmmss') : ''
                        return format
                    },
                    default: ''
                },
                {
                    label: 'Total View',
                    value: 'totalViews',
                    default: ''
                }
            ]
                
            exportCSV(res, {
                header: csvFields,
                data: csv
            })
            res.end()
        } catch (error) {
            res.status(500).json(error)
        }
    } 
}

module.exports = new DownloadController