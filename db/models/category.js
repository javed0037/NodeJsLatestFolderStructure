const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let CategorySchema = new Schema({
   
      categoryImage : {type : String},
      title:{type : String},
      status:{type : Boolean,default : true},  
      categoryName:{type : String},
      createdAt: {type: Number,default: Date.now()}
  
    },
    {
      timestamps: true,
      collection: 'Category',
      strict: true,
      versionKey: false
    });
module.exports = mongoose.model("Category", CategorySchema);