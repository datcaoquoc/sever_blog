import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const postrSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },
        imagepost: {
            type: String,
            default: ''
        },
        poster: { type: Schema.Types.ObjectId, ref: 'user' },
        category: {
            type: String,
            enum: ['kinh tế', 'chính trị','giải trí'],
            default: 'giải trí'
        },
        likecount: {
            type: Number,
            default: 0
        },
        
        is_available: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        censor: { 
            type: Schema.Types.ObjectId, 
            ref: 'user', 
            default: "" 
        },
        createdAt: {
            type: Date,
            default: null,
        }, 
        updateAt: {
            type: Date,
            default: null,
        },
        is_detroy: {
            type: Boolean,
            default: false
        }
    },
  
);


const Post = mongoose.model('post', postrSchema);
export default Post;


