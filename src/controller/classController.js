import { addStudent } from '../service/classService.js';
import '../model/classModel.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import validator from 'validator';

const newClassStudent = async(req, res) => {
    try{
        const {name, phoneNumber,classTime,branch} = req.body;
        

        if(!name || !phoneNumber || !classTime || !branch){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }
        const isValidPhoneNumber = validator.isLength(phoneNumber, {min:10, max:10})
        if(!isValidPhoneNumber){
            return errorResponse(res, "", 400, INVALID_PHONE_NUMBER);
        }

        const classes = await addStudent({name, phoneNumber, classTime, branch});
        return successResponse(res, classes, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {newClassStudent};