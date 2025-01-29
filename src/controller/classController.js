import { addStudent } from '../service/classService.js';
import '../model/classModel.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER } from '../message/messages.js';
import { successResponse } from '../response/response.js';

const classOptions = async(req, res) => {
    try{
        const options = {
            classTime : ['4:00-5:00', '5:00-6:00', '6:00-7:00'],
            branch : ['Bopal', 'Shyamal'],
        }
       
    }catch(error){

    }
}

const newClassStudent = async(req, res) => {
    try{
        const {name, phoneNumber, classTime, branch} = req.body;

        if(!name || !phoneNumber || !classTime || !branch){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }
        if(phoneNumber.length!=10){
            return errorResponse(res, "", 400, INVALID_PHONE_NUMBER);
        }
        const classes = await addStudent({name, phoneNumber, classTime, branch});
        return successResponse(res, classes, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {classOptions, newClassStudent};