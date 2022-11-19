const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const validator = require('validator');
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true,"Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: true,
        validator:validator.isEmail
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength:[6,"Password should of minimum length 6"],
        select:false
    },
    verified: {
        type: Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ["admin", "user","faculty"],
        default:"user"
    },
    subscription: {
        id: String,
        status:String
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    wantedTobeFaculty: {
        type: Boolean,
        default:false
    },
    playlist: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        poster:String
    }],
    createdAt: {
        type: Date,
        default:Date.now
    },
    resetPasswordToken: {
        type:String
    },
    resetPasswordExpire: {
        type:String
    },
    emailVerificationToken: {
        type:String
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
});


userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn:"15d"
    })
}


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};


const User = mongoose.model('Users', userSchema);
module.exports = User;