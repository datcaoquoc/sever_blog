import express from 'express';  
const routerUser = express.Router();
import Usercontroller from '../controllers/ControllerUser.js';
import {uploaduser} from '../commons/helper/uploadimage.js';
import {validateuser} from '../commons/validate/user.validate.js'

routerUser.post("/changepassword",Usercontroller.changepassword)
routerUser.get("/getprofile",Usercontroller.getprofile)
routerUser.post("/uploadimguser",uploaduser,Usercontroller.uploadimguser)
routerUser.post("/isroom/:idroom",Usercontroller.isroom)
routerUser.post("/updateprofile", validateuser.validupdateprofile,uploaduser,Usercontroller.updateprofile)


export default routerUser;