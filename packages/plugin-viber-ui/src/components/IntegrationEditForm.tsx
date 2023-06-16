import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import query from '../graphql/queries';
import mutations from '../graphql/mutations';
import { useQuery, useMutation } from '@apollo/client';

interface IProps {
  integrationId: string;
  saveButtonClicked: boolean;
}

const IntegrationEditForm = (props: IProps) => {
  let token: string = '';

  const [newToken, setNewToken] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);

  useEffect(() => {
    setSaveButtonClicked(props.saveButtonClicked);
  }, [props.saveButtonClicked]);

  const { data, loading } = useQuery(gql(query.viberIntegrationDetail), {
    variables: { integrationId: props.integrationId }
  });

  const [response] = useMutation(gql(mutations.viberIntegrationUpdate));

  if (loading) {
    return <></>;
  } else {
    token = data.viberIntegrationDetail.token;
  }

  const onChangeToken = (e: any) => {
    setNewToken(e.target.value);
  };

  if (saveButtonClicked) {
    setSaveButtonClicked(false);
    response({
      variables: {
        update: {
          inboxId: props.integrationId,
          token: newToken
        }
      }
    });
    //50e486c1f867e4cc-faa151fa47843647-3312be901c5f82f7
  }

  return (
    <FormGroup>
      <ControlLabel required={false}>Token</ControlLabel>
      <FormControl
        name="token"
        required={false}
        autoFocus={false}
        defaultValue={token}
        onChange={onChangeToken}
      />
    </FormGroup>
  );
};

export default IntegrationEditForm;
