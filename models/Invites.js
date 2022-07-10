
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Invite = new Schema( {
    AdminID :{ type:String, required:true},
    GroupID: { type: Number , required:true },
    Invite_TO: { type:String, required:true },
    Status: {type:String, required:true, }
});



module.exports =  mongoose.model('Invite',Invite);
