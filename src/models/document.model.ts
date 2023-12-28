import { Model, Schema, model } from "mongoose";

interface IDocument {
    createdBy: Schema.Types.ObjectId;
    title: string;
    content: Array<any>;
}

interface IDocumentModels {
}

type DocumentModel = Model<IDocument, {}, IDocumentModels>

const documentSchema = new Schema<IDocument, DocumentModel, IDocumentModels>({
    title: {
        required: true,
        type: String,
        trim: true,
    },
    content: {
        type: [],
        default: [],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {

    collection: 'documents',
    timestamps: true
})

const Document = model("Document", documentSchema);

export { Document }