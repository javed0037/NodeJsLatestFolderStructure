const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let VideoSchema = new Schema({
      categoryId : {type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'},
      videoFile : {type : String},
      videoName : {type : String},
      title:{type : String},
      subtitle:{type : String},
      like:{type : Number},
      share:{type : String},
      thumbnainimg:{type : String},
      createdAt: {
          type: Number,default: Date.now()
        }
},{
  timestamps: true,
  collection: 'Video',
  strict: true,
  versionKey: false
});

module.exports = mongoose.model("Video", VideoSchema);