import * as z from "zod"

const forgetPasswordSchema = z.object({
    email:z.email().trim()
})

export default forgetPasswordSchema