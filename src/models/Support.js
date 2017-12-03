import mongoose from 'mongoose';

const schema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String
});

export default mongoose.model('Support', schema);
