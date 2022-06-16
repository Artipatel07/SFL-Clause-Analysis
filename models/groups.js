const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

const clauseSchema = new mongoose.Schema({
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    context: { type: String, required: true },
    visibility: { type: String, default: 'public' },
    clause: { type: String, required: true },
    isAnswered: { type: Boolean, default: false }
});

const Groups = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    groupID: { type: Number, required: true, unique: true },
    groupClauses: [clauseSchema],
    owner: { type: mongoose.Schema.Types.ObjectId },
    groupCapacity: { type: Number, required: true },
    createdOn: { type: Date, required: true, default: Date.now },
    members: [memberSchema],
});


module.exports = mongoose.model('Groups', Groups);