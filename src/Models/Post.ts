import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    sender: string;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, required: true },
});

export default mongoose.model<IPost>('Post', PostSchema);
