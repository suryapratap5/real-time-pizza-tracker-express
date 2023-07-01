const passport = require("passport");
const User = require("../../models/user");
const bycrpt = require('bcrypt')

function authController() {
    return {

        login(req, res){
            res.render('auth/login')
        },

        async postLogin(req, res, next){
            passport.authenticate('local', (err, user, info) =>{
                console.log(user,'user >>>>>>>>>')
                console.log(info,'info >>>>>>>>>')
                if(err){
                    console.log(err, 'errrrr')
                    req.flash('error', info.message)
                    return next(err)
                }


                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect('/')
                })
            })(req,res, next)


        },

        register(req, res){
            res.render('auth/register')
        },
        async postRegister(req, res){

            try {
                const { name, email, password } = req.body;
                // validate request
                if(!name || !email || !password){
                    req.flash('error', 'All fields are required!')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }

                
                // if email exists
                const isUser = await User.exists({email: email})
                if(isUser){
                        req.flash('error', '*Email already taken')
                        req.flash('name', name)
                        req.flash('email', email)
                        return res.redirect('/register')
                }
                
                // Hash password
                const hashedPassword = await bycrpt.hash(password, 10)
                // Create a user 
                const user = new User({
                    name, email, password : hashedPassword
                })

               const registerUser = await user.save()
               return res.redirect('/')
                
            } catch (error) {
                console.log(error, 'error')
                req.flash('error', 'Something went wrong!')
                return res.redirect('/register')
            }
            
        },

        logout(req, res){
            // req.logout()
            req.logout((err) =>{
                if (err) { return next(err); }
                return res.redirect('/login')
            })
        }

    }
}

module.exports = authController