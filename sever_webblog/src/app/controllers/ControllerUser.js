import User from '../models/user.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import BaseError from '../commons/helper/BaseError.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const bcryptSalt = 10;

export default {

    async changepassword(req, res) {
        const pass = req.body;
        const iduser = req.user._id;
        await User.findOne({ _id: iduser }, (error, data) => {
            bcrypt.compare(pass.password, data.password, async (err, result) => {
                if (result) {
                    const salt = bcrypt.genSaltSync(bcryptSalt);
                    const hashPass = bcrypt.hashSync(pass.newpassword, salt);
                    const chagepass = await User.updateOne({ _id: iduser }, { password: hashPass });
                    if (chagepass) {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Đổi mật khẩu thành công' },
                        }).return(res)
                    } else {
                        new BaseError({
                            statusCode: 400,
                            error: err,
                        })
                    }
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Mật khẩu không chính xác' },
                    }).return(res);
                }
            })
        }).clone()
    },

    async getprofile(req, res) {
        const iduser = req.user._id;
        await User.findOne({ _id: iduser }, async (err, data) => {
            if (data !== null) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'success', data },
                }).return(res)
            }
            else {
                new BaseError({
                    statusCode: 400,
                    error: err,
                })
            }
        }).clone()
    },
    async uploadimguser(req, res, next) {
        try {
            const path = `http://localhost:3800/imageuser/${req.file.filename}`;
            return new BaseResponse({ statusCode: 200, data: { urlimageuser: path } }).return(res);
        } catch (error) {
            next(error)
        }
    },
    async updateprofile(req, res) {
        const datarequser = req.body;
        const iduser = req.user._id;
        await User.findOne({ _id: iduser }, async (error, data) => {
            bcrypt.compare(datarequser.password, data.password, async (err, result) => {
                if (result) {
                    const changeprofile = await User.updateOne({ _id: iduser },
                        {
                            name: datarequser.name,
                            phoneNumber: datarequser.phoneNumber,
                            gender: datarequser.gender,
                            avatar: datarequser.avatar,
                            address: datarequser.address,
                            updateAcountAt: new Date()
                        });
                    if (changeprofile) {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Cập nhật trang cá nhân thành công' },
                        }).return(res)
                    } else {
                        new BaseError({
                            statusCode: 400,
                            error: err,
                        })
                    }
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Mật khẩu không chính xác' },
                    }).return(res);
                }

            })
        }).clone()
    },

    async isroom(req,res){
        const idroom = req.params.idroom;
        const iduser = req.user._id;
        await User.findByIdAndUpdate(iduser,{room : idroom}, async (error, data) =>{
            if(error){
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'có lỗi xảy ra, phòng không tồn tại' },
                }).return(res);
            }
            return new BaseResponse({
                statusCode: 200,
                data: { message: 'xin vào phòng thành công, vui lòng chờ duyệt...' },
            }).return(res);
        })
    }

}

