function validate (schema){
    return (req,res,next)=>{
        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({
                success:false,
                errors: {"general": "body is empty"}
            })
        }

        const result = schema.safeParse(req.body);

        if(result.success){
            req.body = result.data;
            return next();
        }

        let errors = {};

        result.error.issues.forEach((issue)=>{
            const path = issue.path[0];
            errors[path] = issue.message;
        })

        res.status(400).json({
            success:false,
            errors: errors
        })
    }
}

export default validate;