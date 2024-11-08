import mongoose from 'mongoose';

export const guestSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    addedAt: {
        required: false,
        type: Date,
      }
});

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;