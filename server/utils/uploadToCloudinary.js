import cloudinary from "../config/cloudinary.config.js"
import streamifier  from "streamifier"

const uploadToCloudinary = async ({resource_type="image", buffer, folder}) => {
    return new Promise ((resolve, reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({folder,resource_type}, (error,result)=>{
            if(error){
                reject(error)
            }
            resolve(result)
        })
        streamifier.createReadStream(buffer).pipe(uploadStream)
    })
}

export default uploadToCloudinary
