import '../model/teamModel.js';
import {addTeamMember} from '../service/teamService.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER, INVALID_EMAIL } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import validator from 'validator';


const createMember = async(req, res) => {
    try{
        const {name, email, phoneNumber, jobRole} = req.body;
        if(!name || !phoneNumber || !email || !jobRole){
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }

        const photo = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;

        const isValidEmail = validator.isEmail(email)
        if(!isValidEmail){
            return errorResponse(res, "", 400, INVALID_EMAIL);
        }

        const isValidPhoneNumber = validator.isLength(phoneNumber, {min:10, max:10})
        if(!isValidPhoneNumber){
            return errorResponse(res, "", 400, INVALID_PHONE_NUMBER);
        }
        const team = await addTeamMember({name, email, phoneNumber, jobRole, photo});
        return successResponse(res, team, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {createMember};