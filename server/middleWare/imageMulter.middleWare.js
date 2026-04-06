import multer from "multer";

const imageMulter = (maxSize,allowTypes)=>{

    const storage = multer.memoryStorage();
    const limits = {fileSize:maxSize*1024*1024}

    const fileFilter = (req,file,cb)=>{
        if(allowTypes.includes(file.mimetype)){
           return cb(null,true)
        }

        cb(new Error("Invalid file type"), false)
    }

    return multer({storage,fileFilter,limits})

}

export  {imageMulter}
