import { MISSING_PARAMETER, NO_TESTIMONY } from '../message/messages.js';
import '../model/testimonialModel.js';
import { addTestimony, showTestimony } from '../service/testimonialService.js';
import { successResponse, errorResponse } from '../response/response.js';

const newTestimony = async(req, res) => {
    try{
        const {name, location, rating, quote} = req.body;
        // if(!name || !location || !rating || !quote){
        //     return errorResponse(res, "", 404, MISSING_PARAMETER)
        // }
        if(!name){
            return errorResponse(res, "", 404, "missing name")
        }
        if(!location){
            return errorResponse(res, "", 404, "missing location")
        }
        if(!rating){
            return errorResponse(res, "", 404, "missing rating")
        }
        if(!quote){
            return errorResponse(res, "", 404, "missing quote")
        }


        const image = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        if(!image){
            return errorResponse(res, "", 404, "missing image")
        }
        
        const Testimony = await addTestimony({name, location, rating, quote, image});
        return successResponse(res, Testimony, 201)
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const displayTestimony = async(req, res) => {
    try{
        const allTestimony = await showTestimony();

        if(!allTestimony){
            return errorResponse(res, "", 400, NO_TESTIMONY);
        }
        return successResponse(res, allTestimony, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {newTestimony, displayTestimony};