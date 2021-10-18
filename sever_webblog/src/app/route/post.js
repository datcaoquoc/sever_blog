import express from 'express';  
const routerPost = express.Router();
import multer from 'multer';
import {validatePost} from '../commons/validate/post.validate.js';
import PostController from '../controllers/ControllerPost.js';
import {uploadpost} from '../commons/helper/uploadimage.js';
import {checkRole} from '../commons/middelware/checkrole.js';
  
routerPost.post('/uploadimage',uploadpost, PostController.uploadimg)
routerPost.post('/creatpost', validatePost.validpost, PostController.creatpost)
routerPost.post('/updatepost', PostController.updatepost)
routerPost.post('/deletepost',checkRole.isAdmin, PostController.deletepost)



export default routerPost;