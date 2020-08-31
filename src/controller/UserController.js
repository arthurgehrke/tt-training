require('dotenv').config()

const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
  async signup(req,res){
    const userData = req.body

    try {
      const findUserWithSameEmail = await User.findOne({email: userData.email})
      const findUserwithSamePhone = await User.findOne({phone: userData.phone})

      if(findUserWithSameEmail) throw new Error('This email its already used')
      if(findUserwithSamePhone) throw new Error('This phone its already used')
      
      const user = await User.create(userData)
      
  
      res.status(201).json(user)
    } catch (err) {
      res.status(400).json({error: err.message})
    }
  }

  async login(req,res){
    const { email, phone, password } = req.body
    try {

      let user
      if(email) user = await User.findOne({email})
      if(phone) user = await User.findOne({phone})

      if(!user) throw new Error('User not found')

      const verifyUserPassword = await bcrypt.compare(password, user.password)

      if(!verifyUserPassword) throw new Error('Wrong password')

      const userId = user.id

      const token = await jwt.sign({userId}, process.env.TOKEN_SECRET, {
        expiresIn: process.env.EXPIRES_IN
      })

      return res.status(200).json({token})
    } catch (err) {
      return res.status(400).json({error: err.message})
    }
  }
  
}

module.exports = new UserController()


