const commonParamsDef = `
  $contentType: String!,
  $name: String!,
  $content: String,
`;

const commonParams = `
  contentType: $contentType,
  name: $name,
  content: $content,
`;

const documentsSave = `
	mutation documentsSave(${commonParamsDef}) {
		documentsSave(${commonParams}) {
			_id
		}
	}
`;

const documentsRemove = `
	mutation documentsRemove($_id: String!) {
		documentsRemove(_id: $_id)
	}
`;

export default {
  documentsSave,
  documentsRemove
};
