const express = require('express');
const path = require('path')
const auth = require('../../middleware/authenticate')
const router = express.Router();

router.get('/', function(req, res) {
    res.render('login');
})

router.get('/register', function(req, res) {
    res.render('register');
})

router.get('/dashboard', function(req, res) {
    res.render('dashboard');
})

router.get('/group', function(req, res) {
    res.render('group');
})

router.get('/group-clauses/:id', function(req, res) {
    res.render('clausesDisplay', {
        groupId: req.params.id
    });
})

module.exports = router;