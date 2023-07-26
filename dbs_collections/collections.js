const mongoose = require('mongoose')
const Schema = mongoose.Schema


//admin schema datas
const adminSchema = new Schema({
    name : {type:String , required: true},
    password : {type:String, required:true},
    email : {type:String, required:true},
})

//user schema

const userSchema = new Schema({
    user_id:{type:Number, required:true},
    name:{type:String , required:true},
    email:{type:String, required: true},
    password:{type:String,required:true}
})

const AdminCollection = mongoose.model('admin',adminSchema)
const userCollection = mongoose.model('user',userSchema)

module.exports = {AdminCollection, userCollection }