const mongoose=require('mongoose')

const Schema=mongoose.Schema

const petsSchema=new Schema({
    petName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    sex:{
        type:String,
        required:true
    },
    parent:{
        type:String,
        required:false
    }
},{timestamps:true})

module.exports=mongoose.model('Pet',petsSchema)
