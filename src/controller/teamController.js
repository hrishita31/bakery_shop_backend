import '../model/teamModel.js';
import {addTeamMember} from '../service/teamService.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER } from '../message/messages.js';

const jobOptions = async(req, res) => {
    try{
        const options = {
            jobRole : ['baker', 'decorator', 'trainer'],
        }
        res.status(200).json({ success: true, data: options });
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

const createMember = async(req, res) => {
    try{
        const {name, email, phoneNumber, jobRole} = req.query;
        if(!name || !phoneNumber || !email || !jobRole){
            res.status(400).json({success:false, message: MISSING_PARAMETER})
        }
        if(phoneNumber.length!=10){
            res.status(400).json({success:false, message:INVALID_PHONE_NUMBER});
        }
        const team = await addTeamMember({name, email, phoneNumber, jobRole});
        res.status(200).json({success:true, message:team});
    }catch(error){
        res.status(500).json({success: false, message:error.message});
    }
}

export {jobOptions, createMember};