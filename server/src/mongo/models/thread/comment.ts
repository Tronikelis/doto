import { Document, ObjectId, PopulatedDoc, Schema, model } from "mongoose";

import { User } from "@mongo";

import formatVotesMethod from "@utils/mongo/formatVotes";

export interface Comment {
    author: PopulatedDoc<User>;
    description: string;
    replies: PopulatedDoc<Comment>[];
    replyTo?: ObjectId;
    date: Date;
    votes: {
        upvotes: PopulatedDoc<User>[];
        downvotes: PopulatedDoc<User>[];
    };
    formattedVotes?: {
        upvotes: number;
        downvotes: number;
        voted: any;
    };
    rootId?: string;
    root?: {
        title: string;
        slug: string;
        image?: string;
        variant: "home" | "explore";
    };
}

interface CommentDocument extends Comment, Document {
    genFormattedVotes: (userId: string) => CommentDocument;
    ban: () => Promise<CommentDocument>;
}

const commentSchema = new Schema<CommentDocument>(
    {
        description: { type: String },
        rootId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
        root: {
            type: {
                title: { type: String },
                slug: {
                    type: String,
                    required: true,
                    index: {
                        unique: true,
                        partialFilterExpression: { "root.slug": { $type: "string" } },
                    },
                },
                image: { type: String, default: null },
                variant: { type: String, required: true, enum: ["home", "explore"] },
            },
            default: null,
        },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        replyTo: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
        replies: { type: [Schema.Types.ObjectId], ref: "Comment" },
        date: { type: Date, default: () => new Date() },
        votes: {
            upvotes: { type: [Schema.Types.ObjectId], ref: "User" },
            downvotes: { type: [Schema.Types.ObjectId], ref: "User" },
        },
    },
    {
        toJSON: { virtuals: true },
    }
);

commentSchema
    .virtual("formattedVotes")
    .set(function (x: any) {
        // @ts-ignore
        return (this._formattedVotes = x);
    })
    .get(function () {
        // @ts-ignore
        return this._formattedVotes;
    });

commentSchema.method("genFormattedVotes", function (userId: string) {
    return formatVotesMethod(this, userId);
});

commentSchema.method("ban", async function () {
    this.description = null;
    this.author = null;

    if (this.root) {
        this.root.title = null;
        this.root.image = null;
    }

    await this.save();
    return this;
});

export const commentModel = model("Comment", commentSchema);
