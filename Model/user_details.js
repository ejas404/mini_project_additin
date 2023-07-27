const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    user_id:{type:Number, required:true},
    name:{type:String , required:true},
    email:{type:String, required: true},
    password:{type:String,required:true}
})

const UserCollection = mongoose.model('user',userSchema)

module.exports = UserCollection