const express = require('express');
const Groups = require('../../models/groups')
const auth = require('../../middleware/authenticate')
const router = express.Router();

router.post('/addClause/:id', auth, async(req, res) => {

    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = []
    let c = {
        createdBy: req.body.createdBy,
        clause: req.body.clause,
        context: req.body.context,
        visibility: req.body.visibility.trim().toLowerCase()
    }
    const docs = await Groups.find({ groupID: req.params.id }).select('members -_id')
    for (const [i, value] of docs[0].members.entries()) {

        if (docs[0].members[i].userName === req.body.createdBy) {
            if (group.groupClauses.length > 0) {
                w = group.groupClauses
            }
            w.push(c)
            group.groupClauses = w
            await group.save().catch(err => res.status(400).send(err))
            return res.status(200).send({ message: " Clause Added ." })
        }
    }
    return res.status(400).send({ message: "This user is not a member of the group." })
})

router.post('/treetest/', (req, res) => {
    //console.log("SFL Generating!");
    const note = {
      text: req.body,
      title: req.body.title
    };

    var myJSON = JSON.stringify(req.body.body).slice(1, -1).replace(/\\/g, "");
    var doc_width = JSON.stringify(req.body.d_width);
    myJSON = JSON.stringify(treeStruc.tree(myJSON, doc_width));
    //console.log("SFL Generated!");
    res.send(myJSON);
    res.send(doc_width);
  });


router.put("/updateContext/:id/:clauseID", auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses
    for (const [i, value] of w.entries()) {
        if (value._id == req.params.clauseID) {
            w[i].context = req.body.context
            group.groupClauses = w
            await group.save()
            return res.status(200).send({ message: 'Updated.' })

        }
    }
    res.status(400).send({ message: 'Could not find.' })
})



router.put('/updateClause/:id/:clauseID', auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses
    for (const [i, value] of w.entries()) {
        if (value._id == req.params.clauseID) {
            w[i].clause = req.body.clause
            group.groupClauses = w
            await group.save()
            return res.status(200).send({ message: 'Updated.' })

        }
    }
    res.status(400).send({ message: 'Could not find.' })

})

router.put('/changeVisibility/:id/:clauseID', auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses
    for (const [i, value] of w.entries()) {
        if (value._id == req.params.clauseID) {

            if (w[i].visibility == 'public') {
                w[i].visibility = 'private'
            } else {
                w[i].visibility = 'public'
            }
            group.groupClauses = w
            await group.save()
            return res.status(200).send({ message: "Visibility Changed." })
        }
    }
    res.status(400).send({ message: 'Could not find.' })

})



router.get('/getAllPub/:id', auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses
    let pubClauses = []
    for (const [i, value] of w.entries()) {
        if (value.visibility == 'public') {
            pubClauses.push(w[i])
        }
    }
    res.status(200).send(pubClauses)
})

router.get('/getAllPvt/:id', auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses
    let pubClauses = []
    for (const [i, value] of w.entries()) {
        if (value.visibility == 'private') {
            pubClauses.push(w[i])
        }
    }
    res.status(200).send(pubClauses)
})


router.get('/getClause/:id/:clauseID', auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses
    for (const [i, value] of w.entries()) {
        if (value._id == req.params.clauseID) {
            res.status(200).send(w[i])
        }
    }
    res.status(400).send({ message: 'Could not find.' })

})

router.delete('/deleteAll/:id', auth, async(req, res) => {

    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = []
    group.groupClauses = w
    await group.save()
    res.status(200).send({ message: " Success" })

})

router.delete('/delete/:id/:clauseID', auth, async(req, res) => {
    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })
    let w = group.groupClauses

    for (const [i, value] of w.entries()) {
        if (value._id == req.params.clauseID) {
            w.splice(i, 1)
        }
    }
    group.groupClauses = w
    await group.save()
    res.status(200).send({ message: " Clause Removed." })


})














module.exports = router;