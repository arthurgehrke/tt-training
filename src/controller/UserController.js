require('dotenv').config()

const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const mailService = require('../services/mailService')

class UserController {
  async getUsers(_, res) {
    const users = await User.find()
    return res.status(200).json(users)
  }

  async signup(req, res) {
    const userData = req.body

    try {
      const findUserWithSameEmail = await User.findOne({
        email: userData.email
      })
      const findUserwithSamePhone = await User.findOne({
        phone: userData.phone
      })
      if (findUserWithSameEmail) throw new Error('This email its already used')
      if (findUserwithSamePhone) throw new Error('This phone its already used')

      const token = crypto.randomBytes(8).toString('hex')

      const user = await User.create({ token, ...userData })

      delete user.token
      delete user.password

      await mailService({
        email: userData.email,
        subject: `Welcome to tt.training ${userData.firstName}`,
        text: `Welcome to our platform, click the link to activate your account. token=${token}`
      })

      res.status(201).json(user)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }

  async login(req, res) {
    const { email, phone, password } = req.body
    try {
      let user
      if (email) user = await User.findOne({ email })
      if (phone) user = await User.findOne({ phone })

      if (!user) throw new Error('User not found')

      const verifyUserPassword = await bcrypt.compare(password, user.password)

      if (!verifyUserPassword) throw new Error('Wrong password')

      const userId = user.id

      const token = await jwt.sign({ userId }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.EXPIRES_IN
      })

      return res.status(200).json({ token })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  async verifyEmail(req, res) {
    const { token } = req.body
    const verifyUserToken = await User.findOne({ token })

    if (!verifyUserToken) {
      return res.status(404).json({ error: 'Invalid token' })
    }

    await User.updateOne({ active: true }).where({ token })

    return res
      .status(200)
      .json({ message: 'Congratulations, your account is active!' })
  }
}

module.exports = new UserController()
