const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please Enter your name"],
        maxLength:[30,"Name cannot exceed 30 character"],
        minLength:[4, "Name should Have more than 5 Characters"]
    },
    email:{
        type: String,
        unique:true,
        required:[true,"Enter your email"],
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Enter your password"],
        minLength:[8, "Password should be of minimum 8 character"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type: String,
        default:"user"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

});
/**************************   Brcypt  ************************************************ */
userSchema.pre("save", async function(next){
    
    // if a user tries to update its profile and not change password;
    // this pre save will again hash the hased password;
    
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

/******************************* JWT  **********************************************************/


userSchema.methods.getJWTToken = function(){
     return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
     })
}

/******************************* Compare Password  **********************************************************/

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

/**************** Generating Password Reset Token *****************/


userSchema.methods.getResetPasswordToken = function(){
    // Not hased but created by crypto
     const resetToken = crypto.randomBytes(20).toString("hex");
    
     // Hasshing and adding resetPasswordToken to userSchema
     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      
     this.resetPasswordExpire = Date.now() + 15 * 60 * 10000;

     return resetToken;
 }



module.exports = mongoose.model('User', userSchema);