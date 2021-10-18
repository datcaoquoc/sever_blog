import express from 'express';  
const routerAdmin = express.Router();
import Admincontroler from '../controllers/ControlerAdmin.js';

routerAdmin.get('/getlistuser/:role/:page', Admincontroler.getlistuser)
routerAdmin.post('/deleteuser', Admincontroler.deleteuser)
routerAdmin.get('/findusersbyname', Admincontroler.findusersbyname)
routerAdmin.get('/findusersbyemail', Admincontroler.findusersbyemail)
routerAdmin.post('/addroom/:newroom', Admincontroler.addroom)


export default routerAdmin;
