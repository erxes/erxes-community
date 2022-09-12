import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import EndPointForm from '../../../../components/forms/jobs/subForms/EndPointForm';
import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { IJob } from '../../../../types';
import { IRouterProps } from '@erxes/ui/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
import { JobRefersAllQueryResponse } from '../../../../../job/types';
import { queries } from '../../../../../job/graphql';
import { withProps } from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';

type Props = {
  id: string;
  queryParams: any;
  activeAction: IJob;
  flowJobs: IJob[];
  addFlowJob: (job: IJob, id?: string, config?: any) => void;
  closeModal: () => void;
};

type FinalProps = {
  jobRefersAllQuery: JobRefersAllQueryResponse;
  currentUser: IUser;
} & Props &
  IRouterProps;

const EndPointFormContainer = (props: FinalProps) => {
  const { currentUser, jobRefersAllQuery } = props;

  const [saveLoading] = useState(false);

  const jobRefers = jobRefersAllQuery.jobRefersAll || [];

  const updatedProps = {
    ...props,
    currentUser,
    saveLoading,
    jobRefers
  };

  return <EndPointForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, JobRefersAllQueryResponse>(gql(queries.jobRefersAll), {
      name: 'jobRefersAllQuery',
      options: ({ id }) => ({
        variables: {
          type: 'endPoint'
        }
      })
    })
  )(withRouter<FinalProps>(EndPointFormContainer))
);
