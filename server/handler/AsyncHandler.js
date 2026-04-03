function AsyncHandler(fn){
    return (req, res, next) => {
        fn(req, res, next).catch((err)=>{
            console.log(err, "Error")
            next(err)
        })
        }

    }

export default AsyncHandler;