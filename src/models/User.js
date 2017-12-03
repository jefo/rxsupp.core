import mongoose from 'mongoose';

const schema = mongoose.Schema({
    clientId: { type: String, required: true },
    ticket: { type: String, required: true },
    email: String
});

export default mongoose.model('User', schema);
