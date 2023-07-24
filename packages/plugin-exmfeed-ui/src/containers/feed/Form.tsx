import { ButtonWrap, FormWrap } from '../../styles';
import { mutations, queries } from '../../graphql';

import BravoForm from '../../components/feed/BravoForm';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import EventForm from '../../components/feed/EventForm';
import Form from '../../components/feed/Form';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import PublicHolidayForm from '../../components/feed/PublicHolidayForm';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import { gql } from '@apollo/client';
import { isEnabled } from '@erxes/ui/src/utils/core';
import { useQuery } from '@apollo/client';

type Props = {
  contentType: string;
  item?: any;
  transparent?: boolean;
  closeModal?: () => void;
};

export default function FormContainer(props: Props) {
  const { contentType, item, transparent } = props;

  const { data } = useQuery(gql(queries.fields), {
    skip: !isEnabled('forms'),
    variables: {
      contentType: `exmFeed${contentType
        .substring(0, 1)
        .toUpperCase()}${contentType.substring(1)}`
    }
  });

  const { data: dataDepartment, loading: loadingDepartment } = useQuery(
    gql(queries.departments)
  );

  if (loadingDepartment) {
    return <Spinner />;
  }

  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      if (callback) {
        callback();
      }
    };

    const variables = {
      ...values
    };

    if (item) {
      variables._id = item._id;
    }

    return (
      <ButtonWrap>
        <ButtonMutate
          mutation={variables._id ? mutations.editFeed : mutations.addFeed}
          variables={variables}
          callback={callBackResponse}
          refetchQueries={[{ query: gql(queries.feed) }]}
          isSubmitted={isSubmitted}
          successMessage={`You successfully ${
            variables._id ? 'edited' : 'added'
          }`}
          type="submit"
          icon="check-circle"
        >
          Send
        </ButtonMutate>
      </ButtonWrap>
    );
  };

  const fields = (data && data.fields) || [];

  const updateProps = {
    ...props,
    fields,
    departments: dataDepartment && dataDepartment.departments,
    renderButton
  };

  const renderContent = () => {
    if (props.contentType === 'post') {
      return <Form {...updateProps} />;
    }

    if (props.contentType === 'event') {
      return <EventForm {...updateProps} />;
    }

    if (props.contentType === 'publicHoliday') {
      return <PublicHolidayForm {...updateProps} />;
    }

    return <BravoForm {...updateProps} />;
  };

  return <FormWrap transparent={transparent}>{renderContent()}</FormWrap>;
}
