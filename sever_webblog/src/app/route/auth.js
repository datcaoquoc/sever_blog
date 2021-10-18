import express from 'express';  
const routerAuth = express.Router();
import {validateUser} from '../commons/validate/auth.validate.js'
import AuthController from '../controllers/ControllerAuth.js';

routerAuth.post('/register', validateUser.validRegister,  AuthController.register)
routerAuth.post('/verificationcodes', AuthController.verificationcodes)
routerAuth.post('/login',validateUser.validLogin, AuthController.login)
routerAuth.post("/generationToken",AuthController.generationToken)
routerAuth.post("/forgotpassword",AuthController.forgotpassword)
routerAuth.post("/checkcodeforgotpassword",AuthController.checkcodeforgotpassword)


export default routerAuth;
