export const types = `
    type RiskConformity {
        _id: String,
        cardId: String,
        cardType: String,
        riskAssessmentId: String,
        riskAssessment:JSON
    }

    type FormDetailType {
        fields:JSON,
        submissions:JSON,
        formId: String
    }
`;

export const queries = `
    riskConformities(cardId:String,riskAssessmentId:String):[RiskConformity]
    riskConformityDetails(cardId:String) :[RiskConformity]
    riskConformitySubmissions(cardId:String,cardType:String) :JSON
    riskConformityFormDetail(cardId:String,userId: String,riskAssessmentId:String) :FormDetailType
`;

export const mutations = `
    addRiskConformity (cardId: String,cardType:String,riskAssessmentId: String):RiskConformity
    updateRiskConformity (cardId: String,cardType:String,riskAssessmentId: String):RiskConformity
    removeRiskConformity (cardId: String,cardType:String):String
`;
