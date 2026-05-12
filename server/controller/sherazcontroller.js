import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/CustomError.js";

const sherazController = AsyncHandler(async(req, res, next) => {

    const sheraz = true;
    if (!sheraz) {
        throw new CustomError("Sheraz is not here", 404);
    }
    res.status(200).json({
        success: true,
        message: "Sheraz Controller"
    })
})

export default sherazController