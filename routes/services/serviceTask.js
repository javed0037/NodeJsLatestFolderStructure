const db = require('../../db'),
    globalFun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let Task = db.Task;
let resultdb = globalFun.resultdb;

var saveTask = async (data) => {
    try {
        let task = new Task(data);
        let taskres = await task.save();
        return resultdb(CONSTANTS.SUCCESS, taskres)
    } catch (error) {
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}

var findTask = async (ownerOfTask) => {
    try {

        var task = await Task.findOne({
            ownerOfTask: ownerOfTask
        });
        if (task === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, task)
        }
    } catch (error) {
        console.log(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};

module.exports = {
    saveTask: saveTask,
    findTask: findTask
};