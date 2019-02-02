const db = require('../../db'),
    globalFun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');

let Video = db.Video;
let Category = db.Category;
let resultdb = globalFun.resultdb;

var uploadvideos  = async(data) =>{
    
    try {
        let video = new Video(data);
        let videores = await video.save();
        return resultdb(CONSTANTS.SUCCESS, videores)
    } catch (error) {
        console.log("errrorv -----------",error);
        
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
            
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}


var addCategory    = async(data)=>{
    try {
        let category = new Category(data);

        let categoryres = await category.save();

        console.log("categoryres",categoryres);
        
        return resultdb(CONSTANTS.SUCCESS, categoryres)
    
    } catch (error) {
        console.log("error",error);     
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }


}


var listCategory    =  async()=>{
    try {
        let result   = await Category.find({});

        return resultdb(CONSTANTS.SUCCESS, result)

    }catch(e){
        console.log("therer are the error",e);
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);

    }

} 


var getVideo  = async(data)=>{
    try{
        console.log("there aer the dsata  ----------",(data))
    let result   = await Video.find(data);
    return resultdb(CONSTANTS.SUCCESS, result)
   
    }catch(e){
     console.log("there are te",e)
     return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}


module.exports = {
    uploadvideos : uploadvideos,
    addCategory : addCategory,
    listCategory : listCategory,
    getVideo   : getVideo,
   
};