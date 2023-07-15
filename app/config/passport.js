const LocalStrategy = require('passport-local')
const User = require('../models/user')
const bycrypt = require('bcrypt')


function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {

            // login 

            // check if user exists
            const user = await User.findOne({ email: email, })
            if (!user) {
                return done(null, false, { message: 'No user with this email' })
            }

            const match = await bycrypt.compare(password, user.password);
            if (match) {
                return done(null, user, { message: 'Logged in successfully' })
            }
            
            return done(null, false, { message: 'Wrong username or password' })
        } catch (error) {
            console.log(error, 'err')
        }


    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user =>{
            done(null, user)
        }).catch(err =>{
            done(err, null)
        }) 
    })

}

module.exports = init