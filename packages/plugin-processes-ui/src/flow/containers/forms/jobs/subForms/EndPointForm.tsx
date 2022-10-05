import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import EndPointForm from '../../../../components/forms/jobs/subForms/EndPointForm';
import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { IJob } from '../../../../types';
import { IRouterProps } from '@erxes/ui/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
import { JobReferDetailQueryResponse } from '../../../../../job/types';
import { queries } from '../../../../../job/graphql';
import { withProps } from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';
import Spinner from '@erxes/ui/src/components/Spinner';

type Props = {
  id: string;
  queryParams: any;
  activeFlowJob: IJob;
  currentTab: string;
  flowJobs: IJob[];
  addFlowJob: (job: IJob, id?: string, config?: any) => void;
  closeModal: () => void;
  setUsedPopup: (check: boolean) => void;
};

type FinalProps = {
  jobReferDetailQuery: JobReferDetailQueryResponse;
  currentUser: IUser;
} & Props &
  IRouterProps;

const EndPointFormContainer = (props: FinalProps) => {
  const { currentUser, jobReferDetailQuery } = props;

  const [saveLoading] = useState(false);

  if (jobReferDetailQuery.loading) {
    return <Spinner />;
  }

  const jobRefer = jobReferDetailQuery.jobReferDetail;

  const updatedProps = {
    ...props,
    currentUser,
    saveLoading,
    jobRefer
  };

  return <EndPointForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, JobReferDetailQueryResponse>(gql(queries.jobReferDetail), {
      name: 'jobReferDetailQuery',
      options: ({ activeFlowJob }) => ({
        variables: {
          id: activeFlowJob.config.jobReferId
        }
      })
    })
  )(withRouter<FinalProps>(EndPointFormContainer))
);
