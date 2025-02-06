import multer from 'multer';
import path from 'path';
// import fs from 'fs';
// import { errorResponse, successResponse } from '../response/response.js';
// import {IMAGE_NOT_UPLOADED, IMAGE_UPLOADED, ERROR_OCCURED} from '../message/messages.js'

const ProductStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/images/product');
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

const MemberStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/images/member');
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

  const TestimonyStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/images/testimony');
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

const uploadProduct = multer({ storage: ProductStorage });
const uploadMember = multer({ storage: MemberStorage });
const uploadTestimony = multer({storage:TestimonyStorage})
export {uploadProduct, uploadMember, uploadTestimony};
// export {uploadImageHelper};