import { addStudent } from '../service/classService.js';
import '../model/classModel.js';
import '../message/messages.js';
import { MISSING_PARAMETER, INVALID_PHONE_NUMBER } from '../message/messages.js';

const classOptions = async(req, res) => {
    try{
        const options = {
            classTime : ['4:00-5:00', '5:00-6:00', '6:00-7:00'],
            branch : ['Bopal', 'Shyamal'],
        }
        res.status(200).json({ success: true, data: options });
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

const newClassStudent = async(req, res) => {
    try{
        const {name, phoneNumber, classTime, branch} = req.body;

        if(!name || !phoneNumber || !classTime || !branch){
            return res.status(404).json({success:false, message: MISSING_PARAMETER });
        }
        if(phoneNumber.length!=10){
            res.status(400).json({success:false, message :INVALID_PHONE_NUMBER});
        }
        const classes = await addStudent({name, phoneNumber, classTime, branch});
        res.status(200).json({success:true, message:classes});
    }catch(error){
        
    }
}

export {classOptions, newClassStudent};