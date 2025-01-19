import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    postId: mongoose.Types.ObjectId;
    sender?: string;
}

const CommentSchema: Schema = new Schema({
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    sender: { type: String },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
