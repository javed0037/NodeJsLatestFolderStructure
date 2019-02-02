const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var moment = require('moment');
CONSTANTS = require('../../utils/constants');

const SALT_WORK_FACTOR = 10;
let UserSchema = new Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    dob: {
        type: String
    },
    password: {
        
        type: String
    },
    gender: {
        type: String
    },
    deviceId : {
     type : String
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isRegistered: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: Date.now()
    },
    point: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral'
    },
    withdrawalAmount: {
        type: Number,
        default: 0
    },
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
module.exports = mongoose.model("User", UserSchema, "users");