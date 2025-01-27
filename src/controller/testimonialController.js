import { MISSING_PARAMETER } from '../message/messages.js';
import '../model/testimonialModel.js';
import { addTestimony } from '../service/testimonialService.js';

const newTestimony = async(req, res) => {
    try{
        const {name, location, rating, quote} = req.body;
        if(!name || !location || !rating || !quote){
            res.status(404).json({success: false, message: MISSING_PARAMETER});

        }
        const Testimony = await addTestimony({name, location, rating, quote});
        res.status(201).json({success:true, message:Testimony});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

export {newTestimony};