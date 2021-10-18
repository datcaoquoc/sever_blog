import Joi from 'joi';
import BaseResponse from '../helper/BaseRespone.js';
const validRegister = async (req, res, next) => {
  const registerSchema = Joi.object({
    name: Joi.string().required().min(2).max(40),
    gender: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  try {
    await registerSchema.validateAsync(req.body, {abortEarly: false})
    next()
  } catch (error) {
    res.status(401).json({errors: new Error(error).message})
  }
}
const validLogin = async (req, res, next) => {
  const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  try {
    await registerSchema.validateAsync(req.body, {abortEarly: false})
    next()
  } catch (error) {
    return new BaseResponse({
      statusCode: 200,
      data: { message: error.message },
    }).return(res);
  }
}

export const validateUser = {validRegister,validLogin}