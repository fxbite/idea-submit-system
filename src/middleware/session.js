
const requiredLogin = (req, res, next) => {
    try {
        if (req.session.logged) {
            next();
          } else {
            return res.redirect('/login')
          }      
    } catch (error) {
        res.status(500).json(error)
    }
}

const managerRole = (req, res, next) => {
  try {
    const status = req.session.role 
    if(status === 0) {
      next()
    } else {
      return res.status(403).json('Permission Denied')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const coordinatorRole = async(req, res, next) => {
  try {
    const status = req.session.role 
    if(status === 0 || status === 1) {
      next()
    } else {
      return res.status(403).json('Permission Denied')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}


module.exports = {requiredLogin, managerRole, coordinatorRole}