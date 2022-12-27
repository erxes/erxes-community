import { Model } from 'mongoose';

import { Document, Schema } from 'mongoose';

interface IVote {
  createdAt: Date;
  createdUserId: string;

  source: string;
  discussionId: string;
  isUp: boolean;
  answer: string;
}

export interface IVoteDocument extends IVote, Document {
  _id: string;
}

const voteSchema = new Schema({
  createdAt: { type: Date },
  createdUserId: { type: String },

  source: { type: String },
  discussionId: { type: String },
  isUp: { type: Boolean },
  answer: { type: String }
});

export interface IVoteModel extends Model<IVoteDocument> {
  vote(doc): void;
}

export const loadVoteClass = models => {
  class Vote {
    /**
     * Marks votes as read
     */
    public static async vote(doc) {
      await models.Votes.remove({
        discussionId: doc.discussionId,
        createdUserId: doc.createdUserId,
        isUp: { $exists: true }
      });

      await models.Votes.remove({
        discussionId: doc.discussionId,
        createdUserId: doc.createdUserId,
        answer: { $exists: true }
      });

      return models.Votes.create(doc);
    }
  }

  voteSchema.loadClass(Vote);

  return voteSchema;
};
