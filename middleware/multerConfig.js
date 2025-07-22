const multer= require('multer')

const storage = multer.diskStorage({//method
    destination : function(req,file,cb){//where to keep the recived file
        cb(null,'./storage')//cb(error,success)
    },
    filename(req,file,cb){//to change name of the file in destination 
        cb(null,Date.now()+"-"+ file.originalname)//Date.now() update the date so that we will have different file name 

    }
})

module.exports= { 
    multer,
    storage
} 