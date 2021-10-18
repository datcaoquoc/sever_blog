
import dotenv from 'dotenv';
dotenv.config();
import { ExtractJwt, Strategy } from "passport-jwt";
import User from '../../models/user.js';

const keyUnlockToken = {

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const strategy = new Strategy(keyUnlockToken, async (jwt_payload, done) => {
    try {
        User.findById(jwt_payload.sub, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, user);
                // or you could create a new account
            }
        })

    } catch (error) {
        done(error, console.log(error))
    }

})
export default strategy;
