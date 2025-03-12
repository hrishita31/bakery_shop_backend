import '../model/teamModel.js';
import {registerToTeam, addMember, showMembers, showTeamMembers, removeMember} from '../service/teamService.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER, INVALID_EMAIL, NO_MEMBERS } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import validator from 'validator';


const createMember = async(req, res) => {
    try{
        const {name, email, phoneNumber, jobRole} = req.body;
        if(!name || !phoneNumber || !email || !jobRole){
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }

        const image = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        
        const isValidEmail = validator.isEmail(email)
        if(!isValidEmail){
            return errorResponse(res, "", 400, INVALID_EMAIL);
        }

        const isValidPhoneNumber = validator.isLength(phoneNumber, {min:10, max:10})
        if(!isValidPhoneNumber){
            return errorResponse(res, "", 400, INVALID_PHONE_NUMBER);
        }
        const team = await registerToTeam({name, email, phoneNumber, jobRole, image, isApproved: null});
        return successResponse(res, team, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const addToTeam = async(req, res) => {
    try{
        const memberId = req.query._id;
        if(!memberId){
            return errorResponse(res, "", 404, MISSING_PARAMETER)
        } 
        const newMember = await addMember(memberId);
        if(!newMember){
            return errorResponse(res, "", 404, NO_MEMBERS)
        }
        return successResponse(res, newMember, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const displayMembers = async(req, res) => {
    try{
        const allMembers = await showMembers();

        if(!allMembers){
            return errorResponse(res, "", 400, NO_MEMBERS);
        }
        return successResponse(res, allMembers, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const displayTeamMembers = async(req, res) => {
    try{
        const allTeamMembers = await showTeamMembers();

        if(!allTeamMembers){
            return errorResponse(res, "", 400, NO_MEMBERS);
        }
        return successResponse(res, allTeamMembers, 200);
    }
    catch(error){

    }
}

const deleteMember = async(req, res) => {
    try{
        const memberId = req.query._id;
        if(!memberId){
            return errorResponse(res, "", 404, MISSING_PARAMETER)
        } 
        const deletedMember = await removeMember(memberId);
        if(!deletedMember){
            return errorResponse(res, "", 404, NO_MEMBERS)
        }
        return successResponse(res, deletedMember, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {createMember, addToTeam, displayMembers, displayTeamMembers, deleteMember};