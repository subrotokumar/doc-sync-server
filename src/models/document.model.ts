import { Schema, model } from "mongoose";

const documentSchema = new Schema({
    uid: {
        required: true,
        type: String,
    },
    title: {
        required: true,
        type: String,
        trim: true,
    },
    content: {
        type: Array,
        default: [],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    collection: 'Documents',
    timestamps: true
})

const Document = model("Document", documentSchema);

module.exports = Document;