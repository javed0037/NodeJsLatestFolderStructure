var express = require('express'),
    router = express.Router(),
    Joi = require('joi'),
    serviceVideo = require('../services/serviceVideo'),
    serviceUser = require('../services/serviceUser'),
    globalFun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient(6379, '127.0.0.1');
let apiSuccessRes = globalFun.apiSuccessRes;

const multer = require('multer');

  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'videofolder');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
 })

var upload = multer({ storage: storage });









var saveVideo   =  async (req, res) => {

   //console.log("threefdfdfd-----------------",req.files);
   
    // Find Mobile
    if (req.files && req.files[0] && req.files[1]) {
        var data = {
        categoryId : req.body.categoryId,
        videoFile :  req.files[1].originalname,
        videoName : req.files[1].filename,
        title:      "whatsApp status",
        subtitle:   "whats App status",
        like:        0,
        share:       0, 
        thumbnainimg: req.files[0].filename
        
    }
       let saveVide2o =  await serviceVideo.uploadvideos(data)
        console.log(' Files saveVide2o saveVide2o => ',saveVide2o);
        return apiSuccessRes(req, res,"image upload successfully")

        
    }       
}

var addCategory = async(req,res)=>{

    if (req.files && req.files[0] && req.files[0]) {
       var reqObj = {
        categoryImage : req.files[0].filename,
        title:   req.body.title,  
        categoryName: req.body.categoryName
       }
       let saveCategary =  await serviceVideo.addCategory(reqObj)
       return apiSuccessRes(req, res,"category save successfully")


}else {

    return apiErrorRes(req, res, 'categoryimage is required ........');

}
}


 var listCategory   = async (req,res)=>{

    let getCategary =  await serviceVideo.listCategory()
    return apiSuccessRes(req, res,"categorylist get  successfully",getCategary.data)


 } 


 var listVideo   = async (req,res)=>{
    let data = {
        "categoryId" : req.body.categoryId.toString()
    }
    let getvideo =  await serviceVideo.getVideo(data)
    console.log("there are the data---------",getvideo)
    return apiSuccessRes(req, res,"listvideo  get successfully",getvideo.data)


 }





router.post('/saveVideo',upload.array('videofile',10), saveVideo);
router.post('/addCategory',upload.array('categoryImage'), addCategory);
router.post('/listCategory', listCategory);
router.post('/listVideo', listVideo);


module.exports = router;