const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    ownerOfTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalEarnedPoints: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: String,
        default: Date.now()
    }
});
module.exports = mongoose.model("Task", TaskSchema);