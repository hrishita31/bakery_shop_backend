import '../model/teamModel.js';
import {addTeamMember} from '../service/teamService.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';

const jobOptions = async(req, res) => {
    try{
        const options = {
            jobRole : ['baker', 'decorator', 'trainer'],
        }
        
    }catch(error){
        // res.status(500).json({success:false, message:error.message});
    }
}

const createMember = async(req, res) => {
    try{
        const {name, email, phoneNumber, jobRole} = req.body;
        if(!name || !phoneNumber || !email || !jobRole){
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }
        if(phoneNumber.length!=10){
            return errorResponse(res, "", 400, INVALID_PHONE_NUMBER)
        }
        const team = await addTeamMember({name, email, phoneNumber, jobRole});
        return successResponse(res, team, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {jobOptions, createMember};