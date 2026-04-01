const mongoose  = require('mongoose');


const studentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    enrollmentNo:{
        type:String,
        required:true,
        unique:true
    },

    department:{
        type:String,
        required:true
    },

    semester:{
        type:String,
        required:true
    },

    mobile:{
        type:String,
        default:"",
    },

    bio:{
        type:String,
        default:"Hey there! I'm using SmartPredict."
    },
    role:{
    type:String,
default:"student",
enum : ["student","faculty"]
    },
    profilePic:{
  type:String,
  default:""
}


},{timestamps:true})


const studentModel = mongoose.model('student', studentSchema);

module.exports = studentModel;