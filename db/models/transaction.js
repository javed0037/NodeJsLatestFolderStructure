const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let TransactionSchema = new Schema({

    ownerOfTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionList: [{
        amount: {
            type: Number,
            required: true,
        },
        transactionDate: {
            type: String,
            default:Date.now()
        },
        status: {
            type: Number,
            default: 5
        },
        type: {
            type: String,
            default: "AD2W"
        },
        isWithdraw: {
            type: Boolean,
            default: false
        },
        comment: {
            type: String,
            default: ''
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
TransactionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.createdAt;
        delete ret.__v;
        return ret;
    }
});
module.exports = mongoose.model("Transaction", TransactionSchema);