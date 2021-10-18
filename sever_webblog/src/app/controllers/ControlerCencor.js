import BaseError from '../commons/helper/BaseError.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import Post from '../models/post.js';
import User from '../models/user.js'

export default {
    // lấy danh sách bài viết chưa được duyệt
    async getpostpending(req, res) {
        const obj = {
            password: 0,
            status: 0,
            validateCode: 0,
            is_available: 0
        }
        try {
            Post.find({ is_available: "Pending" }, obj).populate('poster', 'name').exec(function (err, respone) {
                if (respone !== null) {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: "success", data: respone },
                    }).return(res)
                }
                else {
                    return new BaseError({
                        statusCode: 400,
                        errors: err,
                    })
                }
            });

        } catch (error) {
            return new BaseError({
                statusCode: 400,
                errors: error,
            })
        }
    },

    // duyệt bài viết
    async approvepost(req, res) {
        const idpost = req.query.idpost;
        const idcencor = req.user._id;
        await Post.findById(idpost).exec()
            .then((datapost) => {
                if (datapost.censor !== "") {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'bài viết này đã có người duyệt rồi' },
                    }).return(res)
                } else {
                    Post.findByIdAndUpdate(idpost, { censor: idcencor, is_available: "Active" })
                        .then(respone => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'Đã duyệt bài viết' },
                            }).return(res)
                        }).catch(err => {
                            new BaseError({
                                statusCode: 400,
                                errors: err,
                            })
                        })
                }
            }).catch(err => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            })
    },

    // lấy danh sách người xin vào phòng
    async getlistapplicants(req, res) {
        const idroom = req.user.room;
        const obj = {
            password: 0,
            status: 0,
            validateCode: 0,
            is_available: 0
        }
        try {
            await User.find({ room: idroom, is_room: false }, obj).exec(function (err, respone) {
                if (respone !== null) {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: "success", data: respone },
                    }).return(res)
                }
                else {
                    return new BaseError({
                        statusCode: 400,
                        errors: err,
                    })
                }
            });
        } catch (error) {
            return new BaseError({
                statusCode: 400,
                errors: error,
            })
        }
    },
    // duyệt người dùng vào phòng
    async approveuser(req, res) {
        const iduser = req.params.iduser;
        User.findByIdAndUpdate(iduser, { is_room: true })
            .then(respone => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã cho phép nhân viên này vào phòng' },
                }).return(res)
            }).catch(err => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            })
    },

    // không cho phép nguwoif dùng vào phòng
    async refuseapproveuser(req, res) {
        const iduser = req.params.iduser;
        User.findByIdAndUpdate(iduser, { room: null })
            .then(respone => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã từ chối' },
                }).return(res)
            }).catch(err => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            })
    }
}