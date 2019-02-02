var express = require('express'),
    router = express.Router(),
    Joi = require('joi'),
    serviceTask = require('../services/serviceTask'),
    serviceUser = require('../services/serviceUser'),
    globalFun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient(6379, '127.0.0.1');
//console.log("that working")
let apiSuccessRes = globalFun.apiSuccessRes;
let apiErrorRes = globalFun.apiErrorRes;
let getTaskParamSchema = Joi.object({
    userid: Joi.string().required()
});
let getSubTaskParamSchema = Joi.object({
    userid: Joi.string().required(),
    taskId: Joi.number().required(),
});
let saveTaskParamSchema = Joi.object({
    userid: Joi.string().required(),
    taskId: Joi.number().required(),
});
let saveSubTaskParamSchema = Joi.object({

    userid: Joi.string().required(),
    taskId: Joi.number().required(),
    subTaskId: Joi.number().required(),

});
async function getTask(req, res) {

    let isReqParamValid = null;
    try {
        isReqParamValid = await getTaskParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {

        return apiErrorRes(req, res, 'Send valid param!!!');
    }


    let { userid } = req.body;

    // Find Mobile
    // console.log("taskData555");
    let userData = await serviceUser.getUserById(userid);
    //  console.log("userDatauserDatauserDatauserData ", userData);

    if (userData.statusCode === CONSTANTS.SUCCESS) {

        let taskData = await serviceTask.findTask(userid);
        //console.log("taskData  ", taskData);

        if (taskData.statusCode == CONSTANTS.NOT_FOUND) {

            // console.log("Javed--------------",taskData);

            // console.log("taskData.CONSTANTS.NOT_FOUND  ");
            let reqSaveTaskData = {
                ownerOfTask: userid, totalEarnedPoints: 0, createdAt: Date.now()
            }
            let resSaveTaskData = await serviceTask.saveTask(reqSaveTaskData);

            if (resSaveTaskData.statusCode === CONSTANTS.SUCCESS) {

                // console.log("resSaveTaskData   ", resSaveTaskData);
                let taskDataFromRedis = await client.get(userData.data._id + "");
                if (taskDataFromRedis === null) {
                //  console.log();


                let data1 =     await client.set(userData.data._id + "", JSON.stringify(globalFun.taskMetaData()));

                console.log("there are the data1 ------------",data1);

                    let resData = {
                        list: globalFun.taskMetaData(),
                        points: 33
                    }
                    return apiSuccessRes(req, res, 'success', resData);
                } else {
                    let resData = {
                        list: JSON.parse(taskDataFromRedis),
                        points: 33
                    }
                    return apiSuccessRes(req, res, 'success', resData);
                }
            } else {
                return apiErrorRes(req, res, 'Error to save task!');
            }

        } else {


            let taskDataFromRedis = await client.get(userData.data._id + "");
            if (taskDataFromRedis === null) {

                await client.set(userData.data._id + "", JSON.stringify(globalFun.taskMetaData()));
                let resData = {
                    list: globalFun.taskMetaData(),
                    points: 33
                }
                return apiSuccessRes(req, res, 'success', resData);
            } else {
                console.log("javedkhan that is going this side -------",taskDataFromRedis);

                let resData = {
                    list: JSON.parse(taskDataFromRedis),
                    points: 33
                }
                return apiSuccessRes(req, res, 'success', resData);
            }
        }


    } else if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === false) {
        apiErrorRes(req, res, 'Mobile is registerd and not Verified');
    } else if (userData.statusCode === CONSTANTS.NOT_FOUND) {
        return apiErrorRes(req, res, 'Please enter valid Mobile!!!');
    } else if (userData.statusCode === CONSTANTS.SERVER_ERROR) {
        return apiErrorRes(req, res, 'Server Error!!!');
    } else {


        return apiErrorRes(req, res, 'Error!!!');
    }
}
async function getSubTask(req, res) {

    let isReqParamValid = null;
    try {
        isReqParamValid = await getSubTaskParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {
        //    logger.info("errorerrorerror register")
        return apiErrorRes(req, res, 'Send valid param!!!');
    }
    const { userid, taskId } = req.body;
    // Find Mobile
    let userData = await serviceUser.getUserById(userid);
    if (userData.statusCode === CONSTANTS.SUCCESS) {
        let taskDataFromRedis = await client.get(userData.data._id + "_" + taskId);
        if (taskDataFromRedis === null) {
            await client.set(userData.data._id + "_" + taskId, JSON.stringify(globalFun.subTaskMetaData(taskId)));
            return apiSuccessRes(req, res, 'success', globalFun.subTaskMetaData(taskId));
        }
        return apiSuccessRes(req, res, 'success', JSON.parse(taskDataFromRedis));
    } else if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === false) {
        apiErrorRes(req, res, 'Mobile is registerd and not Verified');
    } else if (userData.statusCode === CONSTANTS.NOT_FOUND) {
        return apiErrorRes(req, res, 'Please enter valid Mobile!!!');
    } else if (userData.statusCode === CONSTANTS.SERVER_ERROR) {
        return apiErrorRes(req, res, 'Server Error!!!');
    } else {
        return apiErrorRes(req, res, 'Error!!!');
    }
}
async function saveTask(req, res) {

    let isReqParamValid = null;
    try {
        isReqParamValid = await saveTaskParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {

        return apiErrorRes(req, res, 'Send valid param!!!');
    }
    // Find Mobile
    const { userid, taskId } = req.body;

    let userData = await serviceUser.getUserById(userid);

    if (userData.statusCode === CONSTANTS.SUCCESS) {

        let subtaskDataFromRedis = await client.get(userData.data._id + "_" + taskId);
        let savetaskStatusFromRedis = await client.get(userData.data._id + "_" + taskId + "_status");
        if (savetaskStatusFromRedis) {
            apiErrorRes(req, res, 'Already Task is saved');
        } else {
            if (subtaskDataFromRedis === null) {
                apiErrorRes(req, res, 'Task Not found');
            } else {
                let subTaskData = JSON.parse(subtaskDataFromRedis);
                let obj = subTaskData.find(o => o.subTaskStatus === false);
                if (obj) {
                    apiErrorRes(req, res, 'Please compleate your subtask');
                } else {
                    let taskData = await serviceTask.findTask(userid);
                    console.log(taskData.data);

                    taskData.data.totalEarnedPoints = parseInt(taskData.data.totalEarnedPoints) + parseInt(CONSTANTS.TASK_POINT_REWARD);
                    try {
                        await taskData.data.save();
                        await client.set(userData.data._id + "_" + taskId + "_status", true);

                        return apiSuccessRes(req, res, 'success');
                    } catch (error) {
                        console.log(error);

                        return apiErrorRes(req, res, 'Server Error!!!');
                    }

                }

            }
        }


    } else if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === false) {
        apiErrorRes(req, res, 'Mobile is registerd and not Verified');
    } else if (userData.statusCode === CONSTANTS.NOT_FOUND) {
        return apiErrorRes(req, res, 'Please enter valid Mobile!!!');
    } else if (userData.statusCode === CONSTANTS.SERVER_ERROR) {
        return apiErrorRes(req, res, 'Server Error!!!');
    } else {
        return apiErrorRes(req, res, 'Error!!!');
    }
}
async function saveSubTask(req, res) {

    let isReqParamValid = null;
    try {
        isReqParamValid = await saveSubTaskParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {

        return apiErrorRes(req, res, 'Send valid param!!!');
    }
    const { userid, taskId, subTaskId } = req.body;

    // Find Mobile
    let userData = await serviceUser.getUserById(userid);

    if (userData.statusCode === CONSTANTS.SUCCESS) {

        let tasksubDataFromRedis = await client.get(userData.data._id + "_" + taskId);

        if (tasksubDataFromRedis === null) {

            apiErrorRes(req, res, 'Task id Not found');

        } else {

            let taskData = JSON.parse(tasksubDataFromRedis);

            var foundIndex = taskData.findIndex(x => x.subTaskId == subTaskId);

           if(foundIndex === -1){

            apiErrorRes(req, res, 'subTask id is not valid');

           }else{
            let item = {
                "taskId": taskId,
                "subTaskId": subTaskId,
                "subTaskStatus": true,
                "subTaskName": "SubTask " + subTaskId
            }
            taskData[foundIndex] = item;

            await client.set(userData.data._id + "_" + taskId, JSON.stringify(taskData));

            //console.log(taskData)
            return apiSuccessRes(req, res, 'success');
        }
    }

    } else if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === false) {
        apiErrorRes(req, res, 'Mobile is registerd and not Verified');
    } else if (userData.statusCode === CONSTANTS.NOT_FOUND) {
        return apiErrorRes(req, res, 'Please enter valid Mobile!!!');
    } else if (userData.statusCode === CONSTANTS.SERVER_ERROR) {
        return apiErrorRes(req, res, 'Server Error!!!');
    } else {
        return apiErrorRes(req, res, 'Error!!!');
    }
}
router.post('/getTask', getTask);
router.post('/getSubTask', getSubTask);
router.post('/saveTask', saveTask);
router.post('/saveSubTask', saveSubTask);


module.exports = router;
