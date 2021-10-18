import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3800;
import cors from 'cors';
import route from './src/app/route/router.js';
import database from './db/connect.js';
import passport from 'passport';
import strategy from './src/app/commons/middelware/mdwpassport.js';
import cookieParser from 'cookie-parser';
import {errorCatcher,errorHandler} from './src/app/commons/helper/errormessage.js'
app.use('/imagepost',express.static('uploads/imagepost'));
app.use('/imageuser',express.static('uploads/imageuser'));
database.connect();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passport.use('jwt', strategy);
app.use(cookieParser())
route(app);
app.use(errorCatcher, errorHandler);
app.listen(port, () => {
    console.log(`server is running at  http://localhost:${port}`);
});