const {User} = require('../models')
const bcrypt = require('bcrypt')
const {registerValidation, loginValidation} = require('../../middleware/validation')
class UserController {

    // [POST] /register
    async registerUser(req, res, next){
  
        try {
            // Hash password
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    
            // Create a new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                fullname: req.body.fullname,
                password: hashedPassword,
                role: req.body.role,
                department: req.body.department
            })

            const savedUser = await newUser.save()
            res.redirect('/user-management')

        } catch (error) {
            res.status(400).json(error)
        }
    }

    // [GET] /login
    async showLogin(req, res, next) {
        try {
            res.render('login/index', {layout: false})
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [POST] /login/auth
    async authLogin(req, res, next) {

        try {
            
            const {username, password} = req.body
            const user = await User.findOne({username: username}).populate('role')
            
            if(!user) {
                return res.status(401).json('Username or password is incorrect') 
            }

            const hashedPassword = user.password
            const check = bcrypt.compareSync(password, hashedPassword)
            
            if(check) {
                const role = String(user.role._id)

                // Manager vs Administrator
                if(role === '623ec6b919af8a0d9cd33b74' || role === '623ec78019af8a0d9cd33b7e') {
                    req.session.logged = true
                    req.session.role = 0
                    req.session.userName = user.fullname
                    req.session.userId = String(user._id)
                    return res.redirect('/report')
                }

                // Coordinator
                if(role === '623ec63819af8a0d9cd33b6e') {
                    req.session.logged = true
                    req.session.role = 1
                    req.session.userName = user.fullname
                    req.session.userId = String(user._id)
                    return res.redirect('/all-submissions')
                }

                // Staff
                if(role === '623ec65219af8a0d9cd33b70'){
                    req.session.logged = true
                    req.session.role = 2
                    req.session.userName = String(user.fullname)
                    req.session.userId = user._id
                    return res.redirect('/all-submissions')
                }

            } else {
                
                return res.redirect('/login')
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [POST] /logout
    async logout(req, res, next) {
        if (req.session) {
          req.session.destroy((err) => {
            if (err) {
              res.status(400).json('Unable to log out');
            }
            return res.redirect('/login')
          });
        } else {
          res.end();
        }
    }
    
    // [PATCH] /user/:id
    async updateUser(req, res, next) {
        try {
            let updatedUser = {}
            if(req.body.password === '') {
                updatedUser = {
                    username: req.body.username,
                    email: req.body.email,
                    fullname: req.body.fullname,
                    role: req.body.role,
                    department: req.body.department
                }
            } else {
                //? Hash password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(req.body.password, salt);

                updatedUser = {
                    username: req.body.username,
                    email: req.body.email,
                    fullname: req.body.fullname,
                    password: hashedPassword,
                    role: req.body.role,
                    department: req.body.department
                }
            }
            
            if(updatedUser !== null) {
                const user = await User.findById(req.params.id)
                await user.updateOne({$set: updatedUser})
            }
            const user = await User.findById(req.params.id)
            res.redirect('/user-management')
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [DELETE] /user/:id
    async deleteUser(req, res, next){

        try {
            const user = await User.findById(req.params.id)
            await user.deleteOne()
            res.redirect('/user-management')
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /user/:id
    async getAUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // [GET] /users
    async getAllUser(req, res, next) {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    
}

module.exports = new UserController