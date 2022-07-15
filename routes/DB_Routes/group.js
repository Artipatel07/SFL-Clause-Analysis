const express = require('express');
const mongoose = require('mongoose')
const Groups = require('../../models/groups')
const InviteSchema = require('../../models/Invites')
const User = require('../../models/user')
const auth = require('../../middleware/authenticate')
const router = express.Router();


router.post('/createGroup/:username', auth, async(req, res) => {

    let user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(400).send({ error: 'No such user present.' })
    let members = []

    let u = {
        name: user.fullName,
        userName: user.username,
        email: user.email,
        isAdmin: true
    }
    members.push(u)
    let group = new Groups({
        groupName: req.body.groupName,
        groupID: req.body.groupID,
        owner: user._id,
        groupCapacity: req.body.groupCapacity,
        members: members,

    })
    await group.save().catch(err => res.status(400).send(err))
    res.status(200).send({ message: "Group Created.", group: group })

})

router.put('/joinGroup/:id/:username', auth, async(req, res) => {


    let user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(400).send({ error: 'No such user present.' })

    let group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Group Does not Exits" })

    let newMenber = {
        name: user.fullName,
        userName: user.username,
        email: user.email
    }
    const docs = await Groups.find({ groupID: req.params.id }).select('members -_id')

    for (const [i, value] of docs[0].members.entries()) {

        if (docs[0].members[i].userName == user.userName || docs[0].members[i].email == user.email) {
            return res.status(400).send({ message: "Already in group." })
        }
    }

    if (group.members.length < group.groupCapacity) {
        var existingMenbers = []
        existingMenbers = group.members
        existingMenbers.push(newMenber)
        group.members = existingMenbers
        await group.save()
        res.status(200).send({ message: "Member Added.", group: group })
    } else {
        return res.status(400).send({ message: "Group Capacity Exceeded." })
    }


})

router.get('/allGroups/', auth, async(req, res) => {

    const allGroups = await Groups.find()
    if (!allGroups) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send(allGroups)
})

router.get('/allOtherGroups/:username', auth, async(req, res) => {
    let group = await Groups.find({ "members.userName" : {$ne :req.params.username }})
    // const allGroups = await Groups.find()
     if (!group) return res.status(400).send({ message: "Something went wrong." })
     res.status(200).send(group)
})

router.get('/allGroups/:username', auth, async(req, res) => {
    let group = await Groups.find({ "members.userName" : req.params.username })
   // const allGroups = await Groups.find()
    if (!group) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send(group)
})

router.delete('/deleteGroup/:id', auth, async(req, res) => {
    const group = await Groups.findOneAndDelete({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send({ message: "Group Deleted." })
})


router.get('/getAllMembers/:id', auth, async(req, res) => {
    const group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send(group.members)

})

router.get('/getUserID/:obj_id', auth, async(req, res) => {
    const user = await User.findOne({ "_id" : req.params.obj_id })
    if (!user) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send(user)

})

router.get('/getUser', auth, async(req, res) => {
    const user = await User.find()
    if (!user) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send(user)

})


router.get('/getGroupID/:obj_id', auth, async(req, res) => {
    const user = await Groups.findOne({ "groupName" : req.params.obj_id })
    if (!user) return res.status(400).send({ message: "Something went wrong." })
    res.status(200).send(user)

})

router.get('/GetInvite/:userName' ,auth, async(req, res) => {
   var groups=[];
    const allAnalysis = await InviteSchema.find({ Invite_TO: req.params.userName , Status : "NULL"})
    for (var i=0 ; i<allAnalysis.length ; i++){
        groups.push(await Groups.find({ groupID: allAnalysis[i].GroupID })) 
      
    }

    if (!groups) return res.status(400).send({ message: "Something went wrong." })
    return res.status(200).send(groups)
})

router.put('/Updateinvite/:id/:userName' ,auth, async(req, res) => {
      await InviteSchema.findOneAndUpdate({ Invite_TO: req.params.userName , GroupID: req.params.id , Status: "NULL"},{Status: "YES"}) 
     return res.status(200).send("Update Sucessfully")
 })

 router.put('/Rejectinvite/:id/:userName' ,auth, async(req, res) => {
    await InviteSchema.findOneAndUpdate({ Invite_TO: req.params.userName , GroupID: req.params.id , Status: "NULL"},{Status: "NO"}) 
   return res.status(200).send("Update Sucessfully")
})
  


router.delete('/removeMember/:id/:userName/:adminUserName', auth, async(req, res) => {

    if (req.params.userName == req.params.adminUserName) {
        return res.status(400).send({ error: 'You are admin. Try deleting group.' })
    }

    const group = await Groups.findOne({ groupID: req.params.id })
    if (!group) return res.status(400).send({ message: "Something went wrong. No group present with given ID." })

    let user = await User.findOne({ username: req.params.adminUserName })
    if (!user) return res.status(400).send({ error: 'No such user present.' })

    // var id1 = mongoose.Types.ObjectId(user._id);
    // var id2 = mongoose.Types.ObjectId(group.owner);
    

        const docs = await Groups.find({ groupID: req.params.id }).select('members -_id')

        for (const [i, value] of docs[0].members.entries()) {

            if (docs[0].members[i].userName == req.params.userName) {
                var existingMenbers = []
                existingMenbers = group.members
                existingMenbers.splice(i, 1)
                group.members = existingMenbers
                await group.save()
                return res.status(200).send({ message: "Member Removed." })

            }
        }
        return res.status(400).send({ message: "User not present in Group." })

    


})













module.exports = router;