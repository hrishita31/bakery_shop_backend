import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, 'public/images');
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

const upload = multer({ storage: storage });
export default upload;