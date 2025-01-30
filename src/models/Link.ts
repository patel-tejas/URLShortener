import mongoose, {Schema, Document} from "mongoose";
import type { Date } from "mongoose";

export interface LinkModel extends Document {
    shorten_url: string;
    url: string;
    expireAfterSeconds: string;
    createdAt: Date
}

const LinkSchema:Schema<LinkModel> = new Schema({
    shorten_url: {type: String, required: true, unique: true},
    url: {type: String, required: true},
    expireAfterSeconds: {type: String, required: true, default: "null"},
    createdAt: {type: Date, required:true}
});

LinkSchema.set('toJSON', {

    transform: (doc, ret) => {

        ret.createdAt = new Date(ret.createdAt);

        return ret;

    }

});


export const LinkModel = mongoose.models.Link as mongoose.Model<LinkModel> || mongoose.model<LinkModel>("Link", LinkSchema);
