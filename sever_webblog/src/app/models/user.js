import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        name: {
            type: String,
            required: true,
            lowercase: true,
            default: 'Anomimous',
            maxLength: 50,
        },
        role: {
            type: String,
            enum: ['staff', 'admin', 'censor'],
            required: true,
            default: 'staff',
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
            minLength: 4,
        },
        validateCode: {
            type: Number,
            default: 0,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            default: '',
        },
        gender: {
            type: String,
            enum: ['male', 'female','other'],
            default: 'other'
        },
        avatar: {
            type: String,
            trim: true,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        chucvu: {
            type: String,
            enum: ['nhanvien', 'admin', 'giamdoc', 'truongphong','phophong'],
            default: 'nhanvien',
        },
        room: { 
            type: Schema.Types.ObjectId, ref: 'room' ,
            default: null
        },
        is_room:{
            type: Boolean,
            default: false
        },
        is_available: {
            type: Boolean,
            default: true
        },
        createAcountAt: {
            type: Date,
            default: null,
        },
        updateAcountAt: {
            type: Date,
            default: null,
        }
    },
  
);


const User = mongoose.model('user', userSchema);
export default User;


