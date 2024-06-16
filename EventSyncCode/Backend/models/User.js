import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        minlength:[3,"Name should be atleast 3 characters long"],
        maxlength:[30,"Name should not be more than 30 characters long"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email address"],
        unique:[true,"User Already registerd"],
        validate:[validator.isEmail,"Please enter valid email address"]
    },
    phone:{
        type:Number,
        required:[true,"Please enter your phone number"],
    },
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:[8,"Password must contain atleast 8 characters"],
        maxlength:[32,"Password should not be more than 32 characters long"],
        select:false
    },
    role: {
    type: String,
    enum: ['TeacherCoordinator', 'HigherManagement', 'OverallAdministrator'],
    default:'TeacherCoordinator',
    required: true,
  },
    department: {
    type: String,
    required: function() {
      // `this` refers to the document being validated
      return this.role === 'HigherManagement';
    },
  },
    createdAt:{
        type:Date,
        default:Date.now
    },
},{
    timestamps:true
});

// Encrypting password before saving user
userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        next();
    }
    this.password =  await bcrypt.hash(this.password,10);
})

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// Generate JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    });
}

export const User = mongoose.model("User",userSchema);
