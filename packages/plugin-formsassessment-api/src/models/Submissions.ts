import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { sendFormsMessage } from '../messageBroker';
import {
  calculateFormResponses,
  calculateResult,
  getAsssignedUsers,
  roundResult
} from '../utils';
import { ISubmissionParams } from './definitions/common';
import {
  submissionSchema,
  ISubmissionDocument
} from './definitions/submissions';
import { IAssessmentsDocument } from './definitions/assessment';

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  formSaveSubmission(params: ISubmissionParams): Promise<ISubmissionDocument>;
  testScore(params: ISubmissionParams): Promise<any>;
  formSubmitHistory(
    cardId: string,
    cardType: string,
    assessmentId: string
  ): Promise<ISubmissionDocument>;
}

type CommonTypes = {
  cardId?: string;
  cardType?: string;
  assessmentId?: string;
  itemId?: string;
  userId?: string;
  groupId?: string;
};

const generateFields = params => {
  const filter: any = {};
  if (params.itemId) {
    filter.itemId = params.itemId;
  }
  if (params.userId) {
    filter.userId = params.userId;
  }
  if (params.cardId) {
    filter.cardId = params.cardId;
  }
  if (params.cardType) {
    filter.cardType = params.cardType;
  }
  if (params.assessmentId) {
    filter.assessmentId = params.assessmentId;
  }
  return filter;
};

export const loadSubmissions = (models: IModels, subdomain: string) => {
  class SubmissionsClass {
    public static async testScore(params: ISubmissionParams) {
      const { itemId, submissions } = params;

      let resultScore = 0;
      let totalPercent = 0;

      const { forms } = await models.Items.findOne({
        _id: itemId
      }).lean();

      const formIds = forms.map(form => form.formId);

      const fields = await sendFormsMessage({
        subdomain,
        action: 'fields.find',
        data: {
          query: { contentType: 'form', contentTypeId: { $in: formIds } }
        },
        isRPC: true,
        defaultValue: []
      });

      for (const form of forms) {
        if (forms.length === 1) {
          const { sumNumber } = await calculateFormResponses({
            responses: submissions,
            fields,
            calculateMethod: form.calculateMethod,
            filter: {}
          });

          resultScore = sumNumber;
        }
        if (forms.length > 1) {
          const fieldIds = fields.map(field => field._id);
          const responses: any = {};

          for (const [key, value] of Object.entries(submissions)) {
            if (fieldIds.includes(key)) {
              responses[key] = value;
            }
          }
          const { sumNumber } = await calculateFormResponses({
            responses: responses,
            fields,
            calculateMethod: form.calculateMethod,
            filter: {}
          });
          resultScore += Number(
            (sumNumber * (form.percentWeight / 100)).toFixed(1)
          );
          totalPercent += form.percentWeight / 100;
        }
      }

      if (forms.length > 1) {
        resultScore = resultScore / totalPercent;
      }

      return { resultScore };
    }

    public static async formSaveSubmission(params: ISubmissionParams) {
      const {
        branchId,
        departmentId,
        operationId,
        cardId,
        cardType,
        itemId
      } = params;

      let commonFilter: any = { cardId, cardType };

      if (branchId) {
        commonFilter.branchId = branchId;
      }

      if (departmentId) {
        commonFilter.departmentId = departmentId;
      }

      if (operationId) {
        commonFilter.operationId = operationId;
      }

      const assessment = await models.Assessments.findOne(commonFilter);

      if (!assessment) {
        throw new Error('Somethin went wrong');
      }

      const { _id, groupId } = assessment;

      /**
       * Calculate the submitted item score of user
       */

      const { forms } = await models.Items.findOne({
        _id: itemId
      }).lean();
      let totalCount = 0;
      let totalPercent = 0;
      let resultSumNumber = 0;

      const filter = generateFields(params);

      for (const form of forms) {
        const fields = await sendFormsMessage({
          subdomain,
          action: 'fields.find',
          data: {
            query: { contentType: 'form', contentTypeId: form.formId }
          },
          isRPC: true,
          defaultValue: []
        });

        if (forms.length === 1) {
          const { sumNumber, submissions } = await calculateFormResponses({
            responses: params.submissions,
            fields,
            calculateMethod: form.calculateMethod,
            filter: { ...filter, assessmentId: _id }
          });

          await models.AssessmentsItems.updateOne(
            { assessmentId: _id, itemId },
            { $inc: { totalScore: sumNumber } }
          );

          resultSumNumber = sumNumber;

          await models.AssessmentsSubmissions.insertMany(submissions);
        }

        if (forms.length > 1) {
          const fieldIds = fields.map(field => field._id);
          const responses: any = {};

          for (const [key, value] of Object.entries(params.submissions)) {
            if (fieldIds.includes(key)) {
              responses[key] = value;
            }
          }
          const { sumNumber, submissions } = await calculateFormResponses({
            responses: responses,
            fields,
            calculateMethod: form.calculateMethod,
            filter: { ...filter, assessmentId: _id }
          });
          totalCount += Number(
            (sumNumber * (form.percentWeight / 100)).toFixed(1)
          );
          totalPercent += form.percentWeight / 100;
          await models.AssessmentsSubmissions.insertMany(submissions);
        }
      }
      if (forms.length > 1) {
        totalCount = totalCount / totalPercent;
        resultSumNumber = totalCount;
        await models.AssessmentsItems.updateOne(
          { assessmentId: _id, itemId },
          { $inc: { totalScore: totalCount } }
        );
      }

      /**
       * calculate the assessment item if all assigned members submitted
       */

      if (
        await this.checkAssessmentItem({
          cardId,
          cardType,
          assessmentId: _id,
          itemId: itemId,
          userId: filter.userId
        })
      ) {
        await this.calculateAssessmentItem({
          assessmentId: _id,
          itemId,
          cardId,
          cardType
        });
      }

      /**
       * if selected some group in assessment check and calculate the assessment sub groups
       */

      if (groupId) {
        await this.checkAndCalculateAssessmentGroup({
          assessmentId: _id,
          groupId: groupId
        });
      }

      /**
       * Calculate the assessment if all assessment items are calculated
       */

      if (
        await this.checkAssessment({
          assessmentId: _id
        })
      ) {
        await this.calculateAssessment({ assessmentId: _id });
      }

      const assessmentItem = await models.AssessmentsItems.findOne({
        assessmentId: _id,
        itemId
      });

      return {
        sumNumber: resultSumNumber,
        resultScore: assessmentItem?.resultScore || 0,
        cardId,
        cardType,
        assessmentId: _id
      };
    }

    static async checkAssessment({ assessmentId }: CommonTypes) {
      const assessment = await models.Assessments.findOne({
        _id: assessmentId
      });
      if (!assessment) {
        return 'Cannot find assessment';
      }

      const { _id, groupId } = assessment;

      let itemIds: any[] = [];

      if (!!groupId) {
        const itemsGroups = await models.AssessmentsGroups.find({
          _id: groupId
        });

        for (const { groups } of itemsGroups) {
          for (const group of groups) {
            itemIds = [...itemIds, ...group.itemIds];
          }
        }
      }
      const count = await models.AssessmentsItems.countDocuments({
        assessmentId: _id,
        itemId: { $in: itemIds },
        status: 'In Progress'
      });
      return count === 0;
    }
    static async checkAssessmentItem({
      cardId,
      cardType,
      assessmentId,
      itemId,
      userId
    }: CommonTypes) {
      let assignedUserIds = (
        await getAsssignedUsers(subdomain, cardId || '', cardType || '')
      ).map(user => user._id);

      if (!assignedUserIds?.length) {
        throw new Error('Something went wrong when fetch assigned users');
      }

      const assessment = await models.Assessments.findOne({
        _id: assessmentId
      });

      const { isSplittedUsers } = assessment as IAssessmentsDocument;

      if (isSplittedUsers) {
        const assessmentGroups = await models.AssessmentsGroups.find({
          assessmentId: assessment?._id,
          assignedUserIds: { $in: [userId] }
        });
        const groupAssignedUserIds = assessmentGroups.reduce((acc, item) => {
          return [
            ...(acc.assignedUserIds || []),
            ...(item.assignedUserIds || [])
          ];
        }, {});
        assignedUserIds = groupAssignedUserIds;
      }

      const submittedUsers = await models.AssessmentsSubmissions.aggregate([
        {
          $match: {
            cardId,
            assessmentId,
            itemId,
            userId: { $in: assignedUserIds }
          }
        },
        {
          $group: {
            _id: '$userId',
            submission: { $push: '$$ROOT' }
          }
        }
      ]);

      return assignedUserIds.every(userId =>
        submittedUsers.some(submittedUser => submittedUser._id === userId)
      );
    }

    static async checkAndCalculateAssessmentGroup({
      assessmentId,
      groupId
    }: CommonTypes) {
      const itemsGroup = await models.ItemsGroups.findOne({
        _id: groupId
      });

      if (!itemsGroup) {
        return 'Cannot find items group';
      }

      for (const group of itemsGroup?.groups || []) {
        const { itemIds, metrics, calculateMethod } = group;

        const calculatedItems = await models.AssessmentsItems.find({
          assessmentId,
          itemId: { $in: itemIds },
          status: { $ne: 'In Progress' }
        });
        if (calculatedItems.length === itemIds.length) {
          const assessmentItems = await models.AssessmentsItems.find({
            assessmentId,
            itemId: { $in: itemIds }
          });

          let totalCount = calculateMethod === 'Multiply' ? 1 : 0;

          for (const assessmentItem of assessmentItems) {
            if (calculateMethod === 'Multiply') {
              totalCount *= assessmentItem.totalScore;
            }
            if (['Addition', 'Average'].includes(calculateMethod)) {
              totalCount += assessmentItem.totalScore;
            }
          }

          if (calculateMethod === 'Average') {
            totalCount = totalCount / (itemIds.length || 1);
          }

          await calculateResult({
            collection: models.AssessmentsGroups,
            metrics,
            resultScore: totalCount,
            filter: {
              assessmentId,
              groupId: group._id
            }
          });
        }
      }
    }

    static async calculateAssessmentItem({
      assessmentId,
      itemId,
      cardId,
      cardType
    }: CommonTypes) {
      const item = await models.Items.findOne({
        _id: itemId
      });
      if (!item) {
        throw new Error(
          'Cannot find item when trying to calculate item result'
        );
      }
      let { metrics, calculateMethod, forms } = item;

      if (forms?.length === 1) {
        metrics = forms[0].metrics;
      }

      const assignedUserIds = (
        await getAsssignedUsers(subdomain, cardId || '', cardType || '')
      ).map(user => user._id);

      const assessmentItem = await models.AssessmentsItems.findOne({
        assessmentId,
        itemId
      });

      let resultScore = 0;

      if (calculateMethod === 'Average') {
        resultScore =
          (assessmentItem?.totalScore || 0) / (assignedUserIds.length || 1);
      } else {
        resultScore = assessmentItem?.totalScore || 0;
      }

      await calculateResult({
        collection: models.AssessmentsItems,
        metrics,
        resultScore,
        filter: {
          assessmentId,
          itemId
        }
      });
    }

    static async calculateAssessment({ assessmentId }: CommonTypes) {
      const assessment = await models.Assessments.findOne({
        _id: assessmentId
      });

      if (!assessment) {
        return 'Cannot find assessment';
      }

      const { groupId, cardId, cardType } = assessment;

      if (groupId) {
        const itemsGroup = await models.ItemsGroups.findOne({
          _id: groupId
        });

        if (!itemsGroup) {
          throw new Error('Invalid items group id');
        }

        const {
          _id,
          groups,
          metrics,
          calculateMethod,
          ignoreZeros
        } = itemsGroup;

        const assignedUsersCount = (
          await getAsssignedUsers(subdomain, cardId, cardType)
        ).length;

        const groupIds = groups.map(group => group._id);

        const assessmentGroups = await models.AssessmentsGroups.find({
          assessmentId: assessment._id,
          groupId: { $in: groupIds }
        });

        let totalCount = calculateMethod === 'Multiply' ? 1 : 0;

        const residualPW = assessmentGroups.reduce((acc, curr) => {
          if (!curr.resultScore) {
            const group = groups.find(group =>
              assessmentGroups.find(
                assessmentGroup => assessmentGroup.groupId === group._id
              )
            );

            return acc + (group?.percentWeight || 0);
          } else {
            return acc;
          }
        }, 0);
        const residualPWCount = assessmentGroups.filter(
          group => group.resultScore
        ).length;

        for (const assessmentGroup of assessmentGroups) {
          const percentWeight = () => {
            let percentWeight = 100;

            const group = groups.find(
              group => group._id === assessmentGroup.groupId
            );

            if (group) {
              percentWeight = group.percentWeight || 100;
            }
            if (ignoreZeros) {
              percentWeight =
                percentWeight +
                Number((residualPW / residualPWCount).toFixed(2));
            }

            return percentWeight;
          };

          (groups.find(group => group._id === assessmentGroup.groupId) || {})
            ?.percentWeight || 100;

          if (calculateMethod === 'Multiply') {
            totalCount *= assessmentGroup.resultScore * (percentWeight() / 100);
          }
          if (['Addition', 'Average'].includes(calculateMethod)) {
            totalCount += assessmentGroup.resultScore * (percentWeight() / 100);
          }
        }
        if (calculateMethod === 'Average') {
          totalCount = totalCount / (assessmentGroups?.length || 1);
        }

        const groupResult = await calculateResult({
          collection: models.AssessmentsGroups,
          metrics,
          resultScore: totalCount,
          filter: { groupId: _id, assessmentId }
        });

        await models.Assessments.findByIdAndUpdate(assessmentId, {
          $set: {
            totalScore: roundResult(totalCount),
            resultScore: roundResult(totalCount / (assignedUsersCount || 1)),
            status: groupResult.status,
            statusColor: groupResult.statusColor,
            closedAt: Date.now()
          }
        });
      } else {
        const assessment = await models.Assessments.findOne({
          _id: assessmentId
        });
        if (!assessment) {
          return;
        }
        const { itemId } = assessment;
        const assessmentItem = await models.AssessmentsItems.findOne({
          assessmentId: assessmentId,
          itemId: itemId
        });

        await models.Assessments.updateOne(
          { _id: assessmentId },
          {
            resultScore: assessmentItem?.resultScore,
            totalScore: assessmentItem?.totalScore,
            status: assessmentItem?.status,
            statusColor: assessmentItem?.statusColor,
            closedAt: Date.now()
          }
        );
      }
    }
  }

  submissionSchema.loadClass(SubmissionsClass);
  return submissionSchema;
};
