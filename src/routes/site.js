const router = require('express').Router()
const {requiredLogin, coordinatorRole, managerRole} = require('../middleware/session')

router.get('/', requiredLogin, (req, res, next) => {
    try {
        const role = req.session.role
        if(role === 0) {
            return res.redirect('/report')
        }

        if(role === 1) {
            return res.redirect('/all-submissions')
        }

        if(role === 2) {
            return res.redirect('/all-submissions')
        }
    } catch (error) {
        res.status(500).render('status/500', {layout: false})
    }
})

router.get('*', (req, res, next) => {
    res.status(404).render('status/404', {layout: false})
})

module.exports = router