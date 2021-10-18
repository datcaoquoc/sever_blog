import mongoose from 'mongoose';

const categoryrSchema = new mongoose.Schema(
    {
        namecategory: {
            type: String,
            required: true
        },
    },
  
);


const Category = mongoose.model('category', categoryrSchema);
export default Category;