import BaseError from '../commons/helper/BaseError.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import User from '../models/user.js';
import Room from '../models/room.js'

export default {
    async getlistuser(req, res) {
        const limit = 5;
        const role = req.params.role;
        let pagenumber = req.params.page;
        console.log(pagenumber)
        pagenumber = pagenumber - 1; //2
        await User.find({})
            .where('role').equals(role)
            .limit(limit) //5
            .skip(limit * pagenumber) //0 5 10
            .then((results) => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { datauser: results },
                }).return(res)
            })
            .catch((err) => {
                new BaseError({
                    statusCode: 500,
                    error: err,
                })
            });
    },
    async deleteuser(req, res) {
        const iduser = req.query.Id;
        await User.findByIdAndUpdate(iduser, { is_available: false },
            function (err, docs) {
                if (err) {
                    new BaseError({
                        statusCode: 500,
                        error: err,
                    })
                }
                else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: "đã vô hiệu hóa tài khoản" },
                    }).return(res)
                }
            });
    },

    async findusersbyname(req, res) {
        const nameuser = req.query.nameuser;
        await User.find({ name: { $regex: nameuser } }, { password: 0 }, function (err, data) {
            if (err) {
                new BaseError({
                    statusCode: 500,
                    error: err,
                })
            }
            else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "sucsess", data },
                }).return(res)
            }
        });
    },
    async findusersbyemail(req, res) {
        const email = req.query.email;
        await User.find({ email: { $regex: email } }, { password: 0 }, function (err, data) {
            if (err) {
                new BaseError({
                    statusCode: 500,
                    error: err,
                })
            }
            else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "sucsess", data },
                }).return(res)
            }
        });
    },

    async addroom(req, res) {
        const newroom = req.params.newroom;
        const room = new Room({
            nameroom: newroom,
        })
        await Room.findOne({ nameroom: newroom }, async (error, data) => {
            if (data === null) {
                room.save()
                    .then(response => {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Tạo phòng thành công' },
                        }).return(res)
                    }).catch(err => {
                        new BaseError({
                            statusCode: 400,
                            errors: err,
                        })
                    });
            }
            else{
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Phòng đã tồn tại' },
                }).return(res)
            }
        })

    }







}
