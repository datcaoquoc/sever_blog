import Post from "../models/post.js";
import BaseResponse from "../commons/helper/BaseRespone.js";
import BaseError from '../commons/helper/BaseError.js'
export default {
    async creatpost(req, res) {
        const datapost = req.body;
        const datauser = req.user;
        const data = new Post({
            content: datapost.content,
            poster: datauser._id,
            category: datapost.category,
            imagepost: datapost.imagepost
        })
        
        data.save()
            .then(response => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Tạo bài viết thành công, đang chờ duyệt...' },
                }).return(res)
            }).catch(err => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            });
    },
    async updatepost(req, res) {
        const idpost = req.query.idpost;
        const iduser = req.user._id;
        const contentupdate = req.body.contentnew;
        await Post.findById(idpost).exec()
            .then((datapost) => {
                if (datapost.poster.toString() === iduser.toString()) {
                    Post.findByIdAndUpdate(idpost, { content: contentupdate, updateAt: new Date() })
                        .then(respone => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'cập nhật bài viết thành công' },
                            }).return(res)
                        }).catch(err => {
                            new BaseError({
                                statusCode: 400,
                                errors: err,
                            })
                        })
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'bạn không có quyền sửa bài viết của người khác' },
                    }).return(res)
                }
            }).catch(err => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            })

    },
    async uploadimg(req, res, next) {
        try {
            const path = `http://localhost:3800/imagepost/${req.file.filename}`;
            return new BaseResponse({ statusCode: 200, data: { urlimagepost: path } }).return(res);
        } catch (error) {
            next(error)
        }
    },

    async deletepost(req,res){
        const idpost = req.query.idpost;
        Post.findByIdAndUpdate(idpost,{is_detroy: true})
        .then((respone) => {
            return new BaseResponse({
                statusCode: 200,
                data: { message: 'xóa bài viết thành công' },
            }).return(res)
        }).catch((err) => {
            new BaseError({
                statusCode: 400,
                errors: err,
            })
        })
    }

}
