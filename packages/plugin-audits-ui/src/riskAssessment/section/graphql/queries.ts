import { riskConformityParams } from '../../common/graphql';

const riskAssessments = `
  query RiskAssessments($categoryId: String,,$searchValue: String,$perPage: Int,$status: String) {
    riskAssessments(categoryId: $categoryId ,perPage: $perPage,searchValue: $searchValue,status: $status) {
      list{_id,name,description,status,categoryId},totalCount
    }
  }
  `;
const riskConforrmities = `
  query RiskConforrmities($cardId: String) {
    riskConforrmities(cardId: $cardId) {
      _id
      cardId
      riskAssessmentId
      riskAssessment
    }
  }
`;

const riskConfimityDetails = `
  query RiskConforrmityDetails($cardId: String) {
    riskConforrmityDetails(cardId: $cardId){
      _id
      cardId
      riskAssessmentId
      riskAssessment
    } 
  }`;

const riskConforrmitySubmissions = `
  query RiskConforrmitySubmissions($cardId: String,$cardType:String) {
    riskConforrmitySubmissions(cardId: $cardId, cardType: $cardType)
  }
`;

const riskConformityDetail = `
  query RiskConforrmityFormDetail($cardId: String,$userId: String,$riskAssessmentId: String,) {
    riskConforrmityFormDetail(cardId: $cardId, userId: $userId,riskAssessmentId: $riskAssessmentId){
      fields
      formId
      submissions
    }
  }
`;

export default {
  riskAssessments,
  riskConforrmities,
  riskConfimityDetails,
  riskConforrmitySubmissions,
  riskConformityDetail
};
