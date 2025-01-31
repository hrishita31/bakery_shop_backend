import { MISSING_PARAMETER } from '../message/messages.js';
import '../model/testimonialModel.js';
import { addTestimony } from '../service/testimonialService.js';
import { successResponse, errorResponse } from '../response/response.js';

const newTestimony = async(req, res) => {
    try{
        const {name, location, rating, quote} = req.body;
        if(!name || !location || !rating || !quote){
            return errorResponse(res, "", 404, MISSING_PARAMETER)
        }

        const photo = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        
        const Testimony = await addTestimony({name, location, rating, quote, photo});
        return successResponse(res, Testimony, 201)
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {newTestimony};