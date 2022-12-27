import { Model } from 'mongoose';

import { Document, Schema } from 'mongoose';

interface IComment {
  createdAt: Date;
  createdUserId: string;

  discussionId: string;
  parentId: string;
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
  content: { type: String }
});

export interface ICommentModel extends Model<ICommentDocument> {
  saveComment({ _id, doc }): void;
}

export const loadCommentClass = models => {
  class Comment {
    /**
     * Marks comments as read
     */
    public static async saveComment({ _id, doc }) {
      if (_id) {
        await models.Comments.update({ _id }, { $set: doc });
        return models.Comments.findOne({ _id });
      }

      doc.createdAt = new Date();

      return models.Comments.create(doc);
    }
  }

  commentSchema.loadClass(Comment);

  return commentSchema;
};
