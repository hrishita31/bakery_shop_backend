import multer from 'multer';
import path from 'path';
// import fs from 'fs';
// import { errorResponse, successResponse } from '../response/response.js';
// import {IMAGE_NOT_UPLOADED, IMAGE_UPLOADED, ERROR_OCCURED} from '../message/messages.js'

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
    onFileUploadStart:function(file){
        if(file.mimetype=='image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            return true;
        }else{
            return false;
        }
    }
  });

//   const handleError = (err, res) => {
//     return errorResponse(res, "", 400, ERROR_OCCURED);
//   }

// const uploadImageHelper = async(req, res) => {
//     const tempPath = req.file.path;
//     const targetPath = path.join(__dirname, "./public/images");

//     if(path.extname(req.file.originalname).toLowerCase() === ".png"){
//         fs.rename(tempPath, targetPath, err => {
//             if(err){
//                 return handleError(err, res);
//             }
//             return successResponse(res, IMAGE_UPLOADED, 201)
//         })
//     }else{
//         fs.unlink(tempPath, err => {
//             if(err){
//                 return handleError(err, res);
//             }
//             return errorResponse(res, "", 400, IMAGE_NOT_UPLOADED);
//         })
//     }
// }

const upload = multer({ storage: storage });
export default upload;
// export {uploadImageHelper};