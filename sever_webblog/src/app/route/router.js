import routerAuth from './auth.js';
import routerPost from './post.js';
import routerAdmin from './admin.js';
import routerUser from './user.js';
import routerCensor from './censor.js'
import passport from "passport";
import {checkRole} from '../commons/middelware/checkrole.js';
import dotenv from 'dotenv';
dotenv.config();
// các router cha sẽ để ở đây.
function route(app){
    const authenticate = passport.authenticate('jwt',{session: false});
    app.use('/auth',routerAuth);
    app.use('/user',authenticate,routerUser);
    app.use('/post',authenticate,routerPost);
    app.use('/admin',authenticate,checkRole.isAdmin,routerAdmin);
    app.use('/censor',authenticate, checkRole.isCensor,routerCensor)
    

}
export default route;

// return new BaseResponse({
//     statusCode: 200,
//     data: { message: "có quyền" , user: req.user },
//   }).return(res)


    
