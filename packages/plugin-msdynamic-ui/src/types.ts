export interface IDynamic {
  _id?: string;
  endPoint?: string;
  username?: string;
  password?: string;
}

// queries
export type MsdynamicQueryResponse = {
  msdynamicConfigs: IDynamic[];
  refetch: () => void;
  loading: boolean;
};

// mutations
export type MutationVariables = {
  _id?: string;
  endPoint?: string;
  username?: string;
  password?: string;
};
export type AddMutationResponse = {
  addMutation: (params: { variables: MutationVariables }) => Promise<any>;
};

export type EditMutationResponse = {
  editMutation: (params: { variables: MutationVariables }) => Promise<any>;
};
