const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user')
const passport = require('passport')

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', passport.authenticate('local', { session: false }), userController.login)
userRouter.post('/logout', passport.authenticate('jwt', { session: false }), userController.logout)

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), userController.getAdmin)
userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), userController.getAuthenticated)

module.exports = userRouter