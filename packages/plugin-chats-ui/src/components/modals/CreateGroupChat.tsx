import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
// erxes
import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';
import * as router from '@erxes/ui/src/utils/router';

import { useHistory } from 'react-router-dom';

type Props = {
  closeModal: () => void;
  startGroupChat: (name: string, userIds: string[]) => void;
};

const CreateGroupChat = (props: Props) => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const history = useHistory();

  const [userIds, setUserIds] = useState(queryParams.userIds || []);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (userIds.length === 1) {
      router.removeParams(history, 'id', 'userIds');
      router.setParams(history, { userId: userIds });
      setUserIds([]);
    } else {
      props.startGroupChat(name, userIds);
      router.removeParams(history, 'userIds');
      router.removeParams(history, 'limit');
      props.closeModal();

      setUserIds([]);
      setName('');
    }
  };

  const handleUserChange = _userIds => {
    setUserIds(_userIds);
  };

  return (
    <>
      <SelectTeamMembers
        label={'Choose team member'}
        name="assignedUserIds"
        initialValue={userIds}
        onSelect={handleUserChange}
      />
      <br />
      {userIds.length > 1 && (
        <FormControl
          placeholder="Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
      )}
      <br />
      <Button style={{ float: 'right' }} onClick={handleSubmit}>
        Create
      </Button>
      <Button
        btnStyle="simple"
        style={{ float: 'right', marginRight: '10px' }}
        onClick={props.closeModal}
      >
        Cancel
      </Button>
    </>
  );
};

export default CreateGroupChat;
