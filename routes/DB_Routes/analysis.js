const express = require('express');
const AnswerSchema = require('../../models/answers')
const Groups = require('../../models/groups')
const auth = require('../../middleware/authenticate')
const mongoose = require('mongoose')
var treeStruc = require("./treeStruc");
const router = express.Router();


router.get('/allAnalysis', auth, async(req, res) => {
    const allAnalysis = await AnswerSchema.find()
    if (!allAnalysis) return res.status(400).send({ message: "Something went wrong." })
    return res.status(200).send(allAnalysis)
})

router.post('/getAnalysis', auth, async(req, res) => {
    var id = mongoose.Types.ObjectId(req.body.clauseID);
    const allAnalysis = await AnswerSchema.findOne({ clauseID: id })
    if (!allAnalysis) return res.status(400).send({ message: "Something went wrong." })
    return res.status(200).send(allAnalysis)
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



router.post('/saveAnswers', async(req, res) => {
    const clauseId = mongoose.Types.ObjectId(req.body.clauseID);
    const analysisPresent = await AnswerSchema.findOne({ clauseID: clauseId });
    const groupId = req.body.groupID;
    const requestObject = JSON.parse(req.body.analysis);
    const oST = {
        id: requestObject.oneStrandTable.id,
        values: requestObject.oneStrandTable.values,
        colspanArray: requestObject.oneStrandTable.colspanArray,
        headings: requestObject.oneStrandTable.headings
    };
    const tST = {
        id: requestObject.threeStrandTable.id,
        values: requestObject.threeStrandTable.values,
        colspanArray: requestObject.threeStrandTable.colspanArray,
        headings: requestObject.threeStrandTable.headings
    };
    let analysisObj = {
        oneStrandTable: oST,
        threeStrandTable: tST,
        oneStrandTableString: requestObject.oneStrandTableString,
        threeStrandTableString: requestObject.threeStrandTableString,
        Tree: requestObject.Tree,
        SFL : requestObject.SFL,
        Annotations : requestObject.Annotations
    }
    let analysisObject = new AnswerSchema({
        userName: req.body.userName,
        groupID: req.body.groupID,
        clauseID: req.body.clauseID,
        analysis: analysisObj
    })
    if (!analysisPresent) {
        await analysisObject.save().catch(err => res.status(400).send(err))
        const currentGroup = await Groups.findOne({ groupID: groupId });
        let originalClauses = currentGroup.groupClauses.filter(grp => grp._id != req.body.clauseID);
        let filteredClause = currentGroup.groupClauses.filter(grp => grp._id == req.body.clauseID);
        currentGroup.groupClauses = [];
        filteredClause[0].isAnswered = true;
        currentGroup.groupClauses = originalClauses.concat(filteredClause);
        await currentGroup.save().catch(err => console.log(err));
    } else {
        await AnswerSchema.findOneAndUpdate({ clauseID: clauseId }, { analysis: analysisObj });
    }
    return res.status(200).send(analysisObject)
})

module.exports = router;