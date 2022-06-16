const mongoose = require('mongoose')
const objCA = {
    csWidth: { type: String },
    idOfCell: { type: String }
};
const oST = {
    id: { type: String },
    values: [
        [{ type: String }]
    ],
    colspanArray: [objCA],
    headings: [{ type: String }]
};
const tST = {
    id: { type: String },
    values: [
        [{ type: String }]
    ],
    colspanArray: [objCA],
    headings: [{ type: String }]
};



const analysis = {
    oneStrandTable: oST,
    threeStrandTable: tST,
    oneStrandTableString: { type: String },
    threeStrandTableString: { type: String },
    Tree:{type:String},
    SFL: {type : Object},
    Annotations : {type : Object}
};
const AnswerSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    groupID: { type: Number, required: true },
    clauseID: { type: mongoose.Schema.Types.ObjectId },
    analysis: analysis
});







module.exports = mongoose.model('Answers', AnswerSchema);