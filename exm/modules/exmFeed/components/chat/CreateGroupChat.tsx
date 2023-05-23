import React, { useState } from 'react';
// import queryString from 'query-string';
// erxes
import Button from '../../../common/Button';
import FormControl from '../../../common/form/Control';
import SelectTeamMembers from '../../../common/team/containers/SelectTeamMembers';
// import * as router from '../../../utils/router';
import { GroupChatModal } from '../../styles';

type Props = {
  closeModal: () => void;
  startGroupChat: (name: string, userIds: string[]) => void;
};

const CreateGroupChat = (props: Props) => {
  // const location = window.location;
  // const queryParams = queryString.parse(location.search);

  const [userIds, setUserIds] = useState([]);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    props.startGroupChat(name, userIds);
    // router.removeParams(history, 'userIds');

    setUserIds([]);
    setName('');
  };

  const handleUserChange = _userIds => {
    setUserIds(_userIds);
  };

  return (
    <GroupChatModal>
      <h3>Create a group chat</h3>
      <FormControl
        placeholder="Name"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
      />
      <br />
      {/* <SelectTeamMembers
        label={'Choose team member'}
        name="assignedUserIds"
        initialValue={userIds}
        onSelect={handleUserChange}
      /> */}
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
    </GroupChatModal>
  );
};

export default CreateGroupChat;
