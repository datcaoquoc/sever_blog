import bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";
import User from '../models/user.js';
import codegeneration from '../commons/service/codegeneration.js';
import randompass from '../commons/service/randompass.js';
import { sendMailService, sendEmailRegisterSuccess, sendEmailForgotpassword, sendEmailNewPass } from '../commons/service/sendEmail.js'
import BaseResponse from '../commons/helper/BaseRespone.js';
import BaseError from '../commons/helper/BaseError.js';
import { endcodeToken } from '../commons/service/encodeToken.js';
import dotenv from 'dotenv'
dotenv.config();

const bcryptSalt = 10;

export default {
    // register
    async register(req, res, next) {
        try {
            const dataNewUsser = req.body;
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(dataNewUsser.password, salt);
            User.findOne({ email: dataNewUsser.email }, (err, data) => {
                if (data !== null && data.status === "Active") {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Email đã tồn tại' },
                    }).return(res)
                }
                if (data !== null && data.status === "Pending") {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Email chưa được xác thực' },
                    }).return(res)
                }
                const newUser = new User({
                    name: dataNewUsser.name,
                    gender: dataNewUsser.gender,
                    email: dataNewUsser.email,
                    validateCode: codegeneration(),
                    password: hashPass,
                })
                newUser
                    .save()
                    .then(response => {
                        sendMailService(newUser);
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'đăng kí thành công' },
                        }).return(res)
                    }).catch(err => {
                        res.send(err)
                    });

            })
        } catch (error) {
            console.log(error)
        }
    },


    // verify code
    async verificationcodes(req, res) {
        try {
            const dataUser = req.body;

            User.findOne({ email: dataUser.email }, (error, data) => {
                if (dataUser.validateCode !== data.validateCode) {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'mã xác thực không chính xác' },
                    }).return(res)
                } else {

                    User.updateOne({ email: dataUser.email }, { status: 'Active', createAcountAt: new Date(), validateCode: '' })
                        .then(response => {
                            sendEmailRegisterSuccess(dataUser);
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'xác thực thành công' },
                            }).return(res)
                        }).catch(err => {
                            new BaseError({
                                statusCode: 400,
                                error: err,
                            })
                        })
                }
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    // login
    async login(req, res) {
        try {
            const userdata = req.body;
            User.findOne({ email: userdata.email }, (error, data) => {
                if (data !== null) {
                    bcrypt.compare(userdata.password, data.password, (err, result) => {
                        if (result) {
                            if (data.status === "Active") {
                                if (data.is_available) {
                                    let tokenAccsess = endcodeToken.encodeTokenAccsess(data._id);
                                    let tokenRefresh = endcodeToken.encodeTokenRefresh(data._id);
                                    return new BaseResponse({
                                        statusCode: 200,
                                        data: { message: 'đăng nhập thành công', tokenAccsess, tokenRefresh },
                                    }).return(res)
                                } else {
                                    return new BaseResponse({
                                        statusCode: 200,
                                        data: { message: 'Tài khoản của bạn đã bị khóa, Vui lòng liên hệ CSKH để biết thên chi tiết' },
                                    }).return(res);
                                }
                            } else {
                                return new BaseResponse({
                                    statusCode: 200,
                                    data: { message: 'tài khoản chưa được xác thực' },
                                }).return(res);
                            }
                        } else {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'email hoặc password không chính xác !!' },
                            }).return(res);
                        }

                    })
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'email hoặc password không chính xác !!' },
                    }).return(res);
                }
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error
            })
        }
    },
    // refreshtoken
    async generationToken(req, res, next) {
        const rftoken = req.headers.authorization.split(' ')[1];
        Jwt.verify(rftoken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) {
                res.status(400).json({
                    err
                })
            } else {
                let newtokenaccess = endcodeToken.encodeTokenAccsess(decode.sub)
                new BaseResponse({
                    statusCode: 200,
                    data: { newtokenaccess },
                }).return(res);
            }
        })
    },

    //quên mật khẩu
    async forgotpassword(req, res) {
        const email = req.body.email;
        const code = codegeneration();
        await User.findOne({ email: email }, async (error, data) => {
            if (data !== null) {
                sendEmailForgotpassword(email, code)
                await User.updateOne({ email: email }, { validateCode: code })
                    .then(respone => {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: `Chúng tôi đã gửi mã xác thực đến ${email} , vui lòng kiểm tra hộp thư thoại !!` },
                        }).return(res);
                    }).catch(err => {
                        return new BaseError({
                            statusCode: 400,
                            error: err
                        })
                    })
            } else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "Địa chỉ email không tồn tại" },
                }).return(res);
            }
        }).clone().catch(err => {
            return new BaseError({
                statusCode: 400,
                error: err
            })
        })
    },

    async checkcodeforgotpassword(req, res) {
        const dataforgot = req.body;
        const passrandom = randompass();
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPassrandom = bcrypt.hashSync(passrandom, salt);
        await User.findOne({ email: dataforgot.email }, async (error, data) => {
            if (dataforgot.codeforgotpass !== data.validateCode) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'mã xác thực không chính xác' },
                }).return(res)
            } else {
                await User.updateOne({ email: dataforgot.email }, { validateCode: "", password: hashPassrandom })
                    .then(respone => {
                        sendEmailNewPass(dataforgot.email, passrandom)
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: "Mật khẩu mới đã được gửi đến email của bạn, Vui lòng kiểm tra hộp thư !!" },
                        }).return(res);
                    }).catch(err => {
                        return new BaseError({
                            statusCode: 400,
                            error: err
                        })
                    })
            }
        }).clone().catch(err => {
            return new BaseError({
                statusCode: 400,
                error: err
            })
        })
    }


}

