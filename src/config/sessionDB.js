const MongoStore = require('connect-mongo')
const {MONGO_URI} = require('./variables')

module.exports = {
    sessionStore: MongoStore.create({
        mongoUrl: MONGO_URI,
    })
}
 