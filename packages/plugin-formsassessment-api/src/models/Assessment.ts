import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { sendFormsMessage } from '../messageBroker';
import { getAsssignedUsers, getItemSubmissions } from '../utils';
import {
  IAssessmentItemssDocument,
  IAssessmentsDocument,
  assessmentsSchema
} from './definitions/assessment';
export interface IAssessmentsModel extends Model<IAssessmentsDocument> {
  addAssessment(params): Promise<IAssessmentsDocument>;
  addBulkAssessment(params): Promise<IAssessmentsDocument>;
  assessmentDetail(_id: string, params: any): Promise<any>;
  assessmentSubmissionDetail(parmas): Promise<any>;
  editAssessment(_id: string, doc: any): Promise<IAssessmentsDocument>;
  removeAssessment(_id: string);
  assessmentAssignedMembers(
    cardId: string,
    cardType: string
  ): Promise<IAssessmentsDocument>;
  assessmentSubmitForm(
    cardId: string,
    cardType: string,
    assessmentId: string,
    userId: string
  ): Promise<IAssessmentsDocument>;
  assessmentItemForm(
    assessmentId: string,
    itemId: string,
    userId: string
  ): Promise<IAssessmentsDocument>;
}

export const loadAssessments = (models: IModels, subdomain: string) => {
  class Assessment {
    public static async addAssessment(params) {
      const { itemId, groupId, groupsAssignedUsers } = params;

      const assessment = await models.Assessments.create({
        ...params,
        isSplittedUsers: await this.checkSplittedUsersByGroup(
          groupsAssignedUsers
        )
      });

      let ids: string[] = [];

      if (itemId) {
        ids = [itemId];
      }

      if (groupId) {
        const itemsGroups = await models.ItemsGroups.find({
          _id: groupId
        });
        for (const { groups } of itemsGroups) {
          for (const group of groups) {
            ids = [...ids, ...group.itemIds];
            const groupAssignedUsers = (groupsAssignedUsers || []).find(
              item => item.groupId === group._id
            );
            await models.AssessmentsGroups.create({
              assessmentId: assessment._id,
              groupId: group._id,
              assignedUserIds: groupAssignedUsers?.assignedUserIds
            });
          }
        }
        await models.AssessmentsGroups.create({
          assessmentId: assessment._id,
          groupId
        });
      }
      const items = await models.Items.find({
        _id: { $in: ids }
      });

      for (const item of items)
        [
          await models.AssessmentsItems.create({
            assessmentId: assessment._id,
            itemId: item._id
          })
        ];

      return assessment;
    }

    public static async addBulkAssessment(params) {
      const { cardType, cardId, bulkItems } = params;

      if (!cardId && !cardType) {
        throw new Error('please provide a card type and a card id');
      }

      let doc = { cardId, cardType };

      const createByIds = async (
        ids: string,
        fieldName: string,
        groupId,
        itemId,
        groupsAssignedUsers: any[]
      ) => {
        if (!!ids?.length) {
          for (const id of ids) {
            {
              await this.addAssessment({
                ...doc,
                groupId: !!groupId ? groupId : undefined,
                itemId: !!itemId ? itemId : undefined,
                [fieldName]: id,
                groupsAssignedUsers
              });
            }
          }
        }
      };

      for (const item of bulkItems) {
        const {
          branchIds,
          departmentIds,
          operationIds,
          groupId,
          itemIds,
          itemId,
          groupsAssignedUsers
        } = item;
        const IdsMap = [
          { key: 'branchId', ids: branchIds },
          { key: 'departmentId', ids: departmentIds },
          { key: 'operationId', ids: operationIds }
        ];

        if (!!itemIds?.length) {
          IdsMap.push({ key: 'itemId', ids: itemIds });
        }

        for (const { ids, key } of IdsMap) {
          createByIds(ids, key, groupId, itemId, groupsAssignedUsers);
        }
      }
    }

    public static async editAssessment(_id, doc) {
      const assessment = await models.Assessments.findOne({ _id });

      if (!assessment) {
        throw new Error('Could not find assessment');
      }

      const { itemId, groupId, groupsAssignedUsers } = doc;
      let unsetFields: any = {};

      /**
       * Update assessment groups if has groupId
       */

      if (itemId && groupId) {
        for (const [key] of Object.entries(assessment.toObject())) {
          if (['itemId', 'groupId'].includes(key)) {
            if (assessment[key]) {
              delete doc[key];
              unsetFields = { [key]: 1 };
            }
          }
        }
      }

      if (await this.checkSplittedUsersByGroup(groupsAssignedUsers)) {
        const groupIds = await this.getGroupIds(groupId);
        for (const groupId of groupIds) {
          const groupAssignedUsers = groupsAssignedUsers.find(
            group => group.groupId === groupId
          );
          await models.AssessmentsGroups.updateOne(
            { assessmentId: assessment._id, groupId },
            {
              $set: {
                assignedUserIds: groupAssignedUsers?.assignedUserIds || []
              }
            }
          );
        }

        if (!assessment.isSplittedUsers) {
          await models.Assessments.updateOne(
            { _id: assessment._id },
            { $set: { isSplittedUsers: true } }
          );
        }
      }
      if (groupId && groupId !== assessment.groupId && !assessment.itemId) {
        const itemIds = await this.getGroupsItemIds(groupId);
        const RAItems = await models.AssessmentsItems.find({
          assessmentId: _id
        });

        const removeIds = RAItems.filter(
          assessmentItem => !itemIds.includes(assessmentItem.itemId)
        ).map(assessmentItem => assessmentItem._id);

        const addItems = itemIds
          .filter(itemId =>
            RAItems.some(assessmentItem => assessmentItem.itemId !== itemId)
          )
          .map(itemId => ({ assessmentId: _id, itemId }));

        await models.AssessmentsItems.deleteMany({
          _id: { $in: removeIds }
        });

        await models.AssessmentsItems.insertMany(addItems);
      }

      if (itemId && !assessment.groupId && itemId !== assessment.itemId) {
        await models.AssessmentsItems.updateOne(
          {
            assessmentId: assessment._id
          },
          {
            $set: { itemId: itemId }
          }
        );
      }

      return await models.Assessments.updateOne(
        { _id },
        { $unset: { ...unsetFields }, $set: { ...doc } }
      );
    }

    public static async removeAssessment(_id) {
      const assessment = await models.Assessments.findOne({ _id });

      if (!assessment) {
        throw new Error('Could not find assessment');
      }

      if (assessment.groupId) {
        await models.AssessmentsGroups.deleteMany({
          assessmentId: assessment._id
        });
      }

      await models.AssessmentsSubmissions.deleteMany({
        assessmentId: assessment._id
      });

      await models.AssessmentsItems.deleteOne({
        assessmentId: assessment._id
      });

      return assessment.remove();
    }

    public static async assessmentAssignedMembers(cardId, cardType) {
      const assessments = await models.Assessments.find({
        cardId,
        cardType
      });

      if (!assessments.length) {
        throw new Error('Could not find assessment');
      }

      const assessmentIds = assessments.map(assessment => assessment._id);

      let assessmentItemIds = (
        await models.AssessmentsItems.find({
          assessmentId: { $in: assessmentIds }
        })
      ).map(assessmentItem => assessmentItem.itemId);

      let assignedUsers = await getAsssignedUsers(subdomain, cardId, cardType);

      for (const assignedUser of assignedUsers) {
        for (const assessment of assessments) {
          if (assessment.isSplittedUsers) {
            let itemIds: string[] = [];
            const assessmentGroups = await models.AssessmentsGroups.find({
              assessmentId: assessment._id,
              assignedUserIds: { $in: [assignedUser._id] }
            });

            for (const assessmentGroup of assessmentGroups) {
              const groupItemIds = await this.getGroupItemIds(
                assessmentGroup.groupId
              );
              itemIds = [...itemIds, ...groupItemIds];
            }

            assessmentItemIds = itemIds;
          }
        }
        const submittedResults = await models.AssessmentsSubmissions.aggregate([
          {
            $match: {
              assessmentId: { $in: assessmentIds },
              itemId: { $in: assessmentItemIds },
              userId: assignedUser._id
            }
          },
          {
            $group: {
              _id: '$assessmentId',
              itemIds: {
                $addToSet: '$$ROOT.itemId'
              },
              count: { $sum: 1 }
            }
          }
        ]);

        if (!submittedResults.length) {
          assignedUser.submitStatus = 'pending';
        }

        if (
          submittedResults.length >= 1 &&
          assessmentItemIds.some(itemId =>
            submittedResults.find(result => result.itemIds.includes(itemId))
          )
        ) {
          assignedUser.submitStatus = 'inProgress';
        }

        if (
          submittedResults.length >= 1 &&
          assessmentIds.every(assessmentId =>
            submittedResults.some(
              result =>
                result._id === assessmentId &&
                assessmentItemIds.every(itemId =>
                  result.itemIds.includes(itemId)
                )
            )
          )
        ) {
          assignedUser.submitStatus = 'submitted';
        }
      }

      if (
        assessments.every(assessment => assessment.status !== 'In Progress')
      ) {
        assignedUsers = assignedUsers.filter(
          user => user.submitStatus === 'submitted'
        );
      }

      return assignedUsers;
    }

    public static async assessmentSubmitForm(
      cardId,
      cardType,
      assessmentId,
      userId
    ) {
      const assessment = await models.Assessments.findOne({
        _id: assessmentId,
        cardId,
        cardType
      });

      if (!assessment) {
        throw new Error('Could not find assessment');
      }

      let RAItemIds = await models.AssessmentsItems.find({
        assessmentId: assessment._id
      }).distinct('itemId');

      const { isSplittedUsers, groupId } = assessment;

      if (groupId && isSplittedUsers) {
        const itemsGroup = await models.ItemsGroups.findOne({
          _id: groupId
        });

        const groupIds = (itemsGroup?.groups || []).map(group => group._id);

        const assessmentGroups = await models.AssessmentsGroups.find({
          assessmentId: assessment._id,
          groupId: { $in: groupIds },
          assignedUserIds: { $in: [userId] }
        });

        let itemIds: string[] = [];

        for (const assessmentGroup of assessmentGroups) {
          for (const group of itemsGroup?.groups || []) {
            if (assessmentGroup.groupId === group._id) {
              itemIds = [...itemIds, ...group.itemIds];
            }
          }
        }

        RAItemIds = RAItemIds.filter(itemId => itemIds.includes(itemId));
      }

      const items = await models.Items.find({
        _id: { $in: RAItemIds }
      }).lean();

      for (const item of items) {
        const submitted = await models.AssessmentsSubmissions.findOne({
          assessmentId: assessment._id,
          itemId: item._id,
          userId
        });

        if (assessment.groupId) {
          const itemsGroup = await models.ItemsGroups.findOne({
            _id: assessment.groupId,
            'groups.itemIds': { $in: [item._id] }
          });

          let groups = itemsGroup?.groups || [];

          for (const group of groups) {
            if (group.itemIds.includes(item._id)) {
              item.group = group;
            }
          }
        }

        if (submitted) {
          item.submitted = true;
        } else {
          item.submitted = false;
        }
      }
      return items;
    }

    public static async assessmentItemForm(assessmentId, itemId, userId) {
      const assessment = await models.Assessments.findOne({
        _id: assessmentId
      });
      if (!assessment) {
        throw new Error('Could not find assessment');
      }

      const item = await models.Items.findOne({
        _id: itemId
      });

      if (!item) {
        throw new Error('Cannot find item');
      }

      const { forms } = item.toObject();

      const formIds = forms?.map(form => form.formId);

      const query = { contentType: 'form', contentTypeId: { $in: formIds } };

      const fields = await sendFormsMessage({
        subdomain,
        action: 'fields.find',
        data: { query },
        isRPC: true,
        defaultValue: []
      });

      const submittedFields = await models.AssessmentsSubmissions.find({
        assessmentId: assessment._id,
        itemId,
        userId,
        formId: { $in: formIds }
      });

      const editedSubmittedFields = {};

      for (const submittedField of submittedFields) {
        editedSubmittedFields[submittedField.fieldId] = {
          value: submittedField.value,
          description: submittedField.description
        };

        if (submittedField.isFlagged) {
          editedSubmittedFields[
            submittedField.fieldId
          ].isFlagged = !!submittedField.isFlagged;
        }
      }
      return {
        fields,
        withDescription: item.isWithDescription,
        submittedFields: editedSubmittedFields
      };
    }

    public static async assessmentDetail(_id, params) {
      const assessment = await models.Assessments.findOne({
        _id
      }).lean();

      if (!assessment) {
        throw new Error('Cannot find assessment');
      }

      const { cardId, cardType, groupId, itemId } = assessment;

      const assignedUsers = await models.Assessments.assessmentAssignedMembers(
        cardId,
        cardType
      );

      const extendedDoc: any = { ...assessment, assignedUsers };

      if (groupId) {
        const itemsGroup = await models.ItemsGroups.findOne({
          _id: groupId
        });

        const groupAssessments: any[] = [];

        for (const group of itemsGroup?.groups || []) {
          const groupAssessment = await models.AssessmentsGroups.findOne({
            assessmentId: assessment._id,
            groupId: group._id
          }).lean();

          const itemsAssessments = await models.AssessmentsItems.find({
            assessmentId: assessment._id,
            itemId: { $in: group.itemIds }
          }).lean();

          for (const itemAssessment of itemsAssessments) {
            const item = await models.Items.findOne({
              _id: itemAssessment.itemId
            });
            itemAssessment.name = item?.name;
            const submissions = await getItemSubmissions({
              models,
              assessmentId: assessment._id,
              cardId,
              cardType,
              itemId: itemAssessment.itemId,
              subdomain,
              params
            });
            itemAssessment.submissions = submissions;
          }
          groupAssessment.itemsAssessments = itemsAssessments;
          groupAssessments.push(groupAssessment);
        }
        extendedDoc.groupAssessment = groupAssessments;
      }
      if (itemId) {
        const itemAssessment = await models.AssessmentsItems.findOne({
          assessmentId: assessment._id,
          itemId
        }).lean();

        itemAssessment.submissions = await getItemSubmissions({
          models,
          assessmentId: assessment._id,
          cardId,
          cardType,
          itemId: itemAssessment.itemId,
          subdomain,
          params
        });

        extendedDoc.itemAssessment = itemAssessment;
      }
      return extendedDoc;
    }

    public static async assessmentSubmissionDetail(params) {
      const { cardId, cardType, assessmentId } = params;

      const assessment = await models.Assessments.findOne({
        _id: assessmentId
      });

      if (!assessment) {
        throw new Error(`Could not find assessment`);
      }

      const { itemId, groupId } = assessment;

      if (groupId) {
        let itemIds: string[] = [];

        const itemGroup = await models.ItemsGroups.findOne({
          _id: groupId
        });

        for (const group of itemGroup?.groups || []) {
          itemIds = [...itemIds, ...group.itemIds];
        }

        const result = await models.AssessmentsSubmissions.aggregate([
          {
            $match: {
              cardId,
              cardType,
              assessmentId: assessmentId,
              itemId: { $in: itemIds }
            }
          },
          {
            $group: {
              itemId: '$itemId',
              fields: { $push: '$$ROOT' },
              count: { $sum: 1 }
            }
          }
        ]);
        return result;
      }
    }

    static async getGroupsItemIds(groupId: string) {
      let itemIds: string[] = [];
      const itemsGroups = await models.ItemsGroups.find({
        _id: groupId
      });
      for (const { groups } of itemsGroups) {
        for (const group of groups) {
          itemIds = [...itemIds, ...group.itemIds];
        }
      }

      return itemIds;
    }

    static async getGroupItemIds(groupId: string) {
      let itemIds: string[] = [];

      const itemsGroups = await models.ItemsGroups.findOne({
        'groups._id': groupId
      });

      for (const itemGroup of itemsGroups?.groups || []) {
        if (itemGroup._id === groupId) {
          itemIds = itemGroup.itemIds || [];
        }
      }

      return itemIds;
    }

    static async getGroupIds(groupId) {
      let groupIds: string[] = [];

      const itemsGroups = await models.ItemsGroups.find({
        _id: groupId
      });
      for (const { groups } of itemsGroups) {
        for (const group of groups) {
          groupIds = [...groupIds, group._id];
        }
      }
      return groupIds;
    }

    static async checkSplittedUsersByGroup(groupsAssignedUsers) {
      return (
        !!groupsAssignedUsers?.length &&
        groupsAssignedUsers?.every(group => group?.assignedUserIds?.length)
      );
    }
  }
  assessmentsSchema.loadClass(Assessment);
  return assessmentsSchema;
};

export interface IAssessmentItemsModel
  extends Model<IAssessmentItemssDocument> {
  addItem(): Promise<IAssessmentItemssDocument>;
  updateItem(): Promise<IAssessmentItemssDocument>;
}
