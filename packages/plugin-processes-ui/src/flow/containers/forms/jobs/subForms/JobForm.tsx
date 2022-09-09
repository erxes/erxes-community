import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { IUser } from '@erxes/ui/src/auth/types';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';

import { queries } from 'job/graphql';
import { JobRefersAllQueryResponse } from 'job/types';
import JobForm from 'flow/components/forms/jobs/subForms/JobForm';

type Props = {
  id: string;
  queryParams: any;
};

type FinalProps = {
  jobRefersAllQuery: JobRefersAllQueryResponse;
  currentUser: IUser;
} & Props &
  IRouterProps;

const JobFormContainer = (props: FinalProps) => {
  const { currentUser, jobRefersAllQuery } = props;

  const [saveLoading] = useState(false);

  const jobRefers = jobRefersAllQuery.jobRefersAll || [];

  const updatedProps = {
    ...props,
    currentUser,
    saveLoading,
    jobRefers
  };

  return <JobForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, JobRefersAllQueryResponse>(gql(queries.jobRefersAll), {
      name: 'jobRefersAllQuery'
    })
  )(withRouter<FinalProps>(JobFormContainer))
);
