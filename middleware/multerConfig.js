const multer= require('multer')

const storage = multer.diskStorage({//method
    destination : function(req,file,cb){//where to keep the recived file
        cb(null,'./storage')//cb(error,success)
    },
    filename(req,file,cb){//to change name of the file in destination 
        cb(null,"Chiranjibi-"+ file.originalname)//add Chiranjibi- in the org filename

    }
})

module.exports= { 
    multer,
    storage
} 