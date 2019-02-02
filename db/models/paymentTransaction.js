const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let PaymentTransactionSchema = new Schema({
  ownerOfPaymenttransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: Number
  },
  transactionTime: {
    type: Date,
    default: Date.now()
  },
  amount: {
    type: Number,
    default: 0
  },
  payId: {
    type: String
  },
  logo: {
    type: String
  },
  linkedNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  timeStamp: {
    type: String,
    default: Date.now()
  }
});
PaymentTransactionSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  }
});
module.exports = mongoose.model("PaymentTransaction", PaymentTransactionSchema);