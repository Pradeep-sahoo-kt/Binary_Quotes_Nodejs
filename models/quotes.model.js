import mongoose from "mongoose";

const quotesSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const User = mongoose.model("Quotes", quotesSchema);
export default User;
