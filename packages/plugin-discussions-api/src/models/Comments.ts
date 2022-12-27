import { Model } from 'mongoose';

import { Document, Schema } from 'mongoose';

interface IComment {
  createdAt: Date;
  createdUserId: string;

  discussionId: string;
  parentId: string;
  order: string;
  code: string;
  content: string;
}

export interface ICommentDocument extends IComment, Document {
  _id: string;
}

const commentSchema = new Schema({
  createdAt: { type: Date },
  createdUserId: { type: String },

  discussionId: { type: String },
  parentId: { type: String },
  order: { type: String },
  code: { type: String },
  content: { type: String }
});

export interface ICommentModel extends Model<ICommentDocument> {
  saveComment({ _id, doc }): void;
}

export const loadCommentClass = models => {
  class Comment {
    public static async saveComment({ doc }) {
      const parentComment = await models.Comments.findOne({
        _id: doc.parentId
      }).lean();

      doc.order = parentComment
        ? `${parentComment.order}${doc.code}/`
        : `${doc.code}/`;

      doc.createdAt = new Date();

      return models.Comments.create(doc);
    }
  }

  commentSchema.loadClass(Comment);

  return commentSchema;
};
