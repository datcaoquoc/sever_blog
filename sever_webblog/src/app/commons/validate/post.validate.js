import Joi from "joi";
const validpost = async (req, res, next) => {
    const postSchema = Joi.object({
        content: Joi.string().max(1500).required(),
        category: Joi.required(),
        imagepost: Joi.string(),
        
    });
    try {
        await postSchema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({ errors: error.message })
    }
}
export const validatePost = {validpost}