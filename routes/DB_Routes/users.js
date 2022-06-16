const { check, validationResult } = require('express-validator/check');
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();

router.post('/signup', [
        check('username').notEmpty().isLength({ min: 5 }).withMessage('Username must have at least 5 characters'),
        check('fullName').notEmpty(),
        check('password').notEmpty().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        check('email').notEmpty().isEmail(),

    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            let u = await User.findOne({ email: req.body.email })
            if (u) return res.status(400).send({ error: 'Email already registered.' })
            const salt = await bcrypt.genSalt(10)
            const result = await bcrypt.hash(req.body.password, salt)

            let user = new User({
                username: req.body.username,
                fullName: req.body.fullName,
                password: result,
                email: req.body.email
            })
            user = await user.save().catch(err => res.status(400).send(err))
            const tok = jwt.sign({
                    email: req.body.email,
                    password: req.body.password
                },
                'SFL PROJECT')

            res.status(200).header('x-auth-token', tok)
                .send({
                    status: "success",
                    token: tok,
                    username: user.username,
                    name: user.fullName,
                    email: user.email
                })
        }
    })

router.post('/signin', async(req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({ error: 'No account registered with this email .' })
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (validPassword) {
        const tok = jwt.sign({
                email: req.body.email,
                password: req.body.password
            },
            'SFL PROJECT')
        res.status(200).header('x-auth-token', tok).send({
            status: "success",
            username: user.username,
            name: user.fullName,
            email: user.email,
            token: tok
        })
    } else {
        res.status(400).send({ error: 'Wrong Password.' })
    }
})

router.post('/changePassword', async(req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({ error: 'No account registered with this email .' })

    const salt = await bcrypt.genSalt(10)
    const result = await bcrypt.hash(req.body.password, salt)
    user.password = result
    await user.save()
    res.send({ success: 'Password Changed Successfully.' })

})

router.get('/logout', function (req, res) {
 //   req.logout();
 res.send({ success: 'Logout Successfully.' })
    res.redirect('/views');
});


module.exports = router;