import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        nameroom: {
            type: String,
            required: true
        },
    },
  
);
const Room = mongoose.model('room', roomSchema);
export default Room;