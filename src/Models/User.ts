import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    tokens: string[];
}

const UserSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
        password: { type: String, required: true },
        tokens: [{ type: String }], 
    }
);

export default mongoose.model<IUser>('User', UserSchema);
