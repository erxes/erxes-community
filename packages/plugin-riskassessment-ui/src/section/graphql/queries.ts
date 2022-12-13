import { riskConformityParams } from '../../common/graphql';

const riskAssessments = `
  query RiskAssessments($categoryId: String,,$searchValue: String,$perPage: Int,$status: String) {
    riskAssessments(categoryId: $categoryId ,perPage: $perPage,searchValue: $searchValue,status: $status) {
      list{_id,name,description,status,categoryId},totalCount
    }
  }
  `;
const riskConfirmities = `
  query RiskConfirmities($cardId: String) {
    riskConfirmities(cardId: $cardId) {
      _id
      cardId
      riskAssessmentId
      riskAssessment
    }
  }
`;

const riskConformityDetails = `
  query RiskConformityDetails($cardId: String) {
    riskConformityDetails(cardId: $cardId){
      _id
      cardId
      riskAssessmentId
      riskAssessment
    } 
  }`;

const riskConformitySubmissions = `
  query RiskConformitySubmissions($cardId: String,$cardType:String) {
    riskConformitySubmissions(cardId: $cardId, cardType: $cardType)
  }
`;

const riskConformityDetail = `
  query RiskConformityFormDetail($cardId: String,$userId: String,$riskAssessmentId: String,) {
    riskConformityFormDetail(cardId: $cardId, userId: $userId,riskAssessmentId: $riskAssessmentId){
      fields
      formId
      submissions
    }
  }
`;

export default {
  riskAssessments,
  riskConfirmities,
  riskConformityDetails,
  riskConformitySubmissions,
  riskConformityDetail
};
