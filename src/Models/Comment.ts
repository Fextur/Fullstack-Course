import mongoose, { Schema, Document } from "mongoose";
import { IPost } from "./Post";
import { IUser } from "./User";

export interface IComment extends Document {
  content: string;
  postId: IPost["_id"];
  user?: IUser["_id"];
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
