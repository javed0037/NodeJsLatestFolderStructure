const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
let AdminSchema = new Schema({
  password: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  }
});
AdminSchema.pre('save', function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
      // bcrypt.hash(user.otp, salt, function (err, hashotp) {
      //   if (err) return next(err);

      //   // override the cleartext password with the hashed one
      //   user.otp = hashotp;
      //   next();
      // });
    });
  });
});
AdminSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj._id;
  delete obj.created_at;
  delete obj.updated_at;
  delete obj.__v;
  return obj;
};
module.exports = mongoose.model("Admin", AdminSchema, "admin");