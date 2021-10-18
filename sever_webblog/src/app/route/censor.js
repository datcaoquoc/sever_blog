import express from 'express';  
const routerCensor = express.Router();
import {checkRole} from '../commons/middelware/checkrole.js'
import Censorcontroler from '../controllers/ControlerCencor.js';

routerCensor.get('/getpostpending',  Censorcontroler.getpostpending)
routerCensor.post('/approvepost',  Censorcontroler.approvepost)
routerCensor.get('/getlistapplicants',checkRole.isTruongphong, Censorcontroler.getlistapplicants)
routerCensor.post('/approveuser/:iduser',checkRole.isTruongphong, Censorcontroler.approveuser)
routerCensor.post('/refuseapproveuser/:iduser',checkRole.isTruongphong, Censorcontroler.refuseapproveuser)


export default routerCensor;