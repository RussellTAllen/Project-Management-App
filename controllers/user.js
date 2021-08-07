const JWT = require('jsonwebtoken')
const User = require('../models/User')

const signToken = userID => {
    return JWT.sign({ 
        iss: "CatchdiGiorno",
        sub: userID
    }, "CatchdiGiorno", { expiresIn: "1h" })
}

module.exports = {
    registerUser: async (req, res) => {
        const { username, password, role } = req.body
        await User.findOne({ username }, async (err, user) => {
            if(err)
                res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
            if(user)
                res.status(400).json({ message: { msgBody: 'Username is already taken', msgError: true }})
            else{
                const newUser = await new User({ username, password, role })
                newUser.save(err => {
                    if(err)
                        res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                    else
                        res.status(201).json({ message: { msgBody: 'Account successfully created', msgError: false }})
                })
            }
    
        })
    },
    login: async (req, res) => {
        if(req.isAuthenticated()){
            const { _id, username, role } = req.user
            const token = signToken(_id)
            res.cookie('access_token', token, { httpOnly: true, sameSite: true })
            res.status(200).json({ isAuthenticated: true, user: { username, role }})
        }
    },
    logout: async (req, res) => {
        console.log('controller logout...')
        res.clearCookie('access_token')
        res.json({ user: { username: '', role: '' }, success: true})
    },
}