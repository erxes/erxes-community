import React from 'react';
import { Link } from 'react-router-dom';
// erxes
import Avatar from '@erxes/ui/src/components/nameCard/Avatar';
import Icon from '@erxes/ui/src/components/Icon';
import Tip from '@erxes/ui/src/components/Tip';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import CommonSidebar from '@erxes/ui/src/layout/components/Sidebar';
import { IUser } from '@erxes/ui/src/auth/types';
// local
import AddMember from '../containers/modals/AddMember';
import {
  SidebarWrapper,
  SidebarHeader,
  ParticipantList,
  ParticipantItem,
  ParticipantDetails,
  ParticipantSubDetails,
  Subtitle,
  DirectWrapper,
  DirectDetailItem,
  OptionsWrapper,
  OptionsButton
} from '../styles';

type Props = {
  chatDetail: any;
  currentUser: IUser;
  makeOrRemoveAdmin: (id: string) => void;
  addOrRemoveMember: (type: string, userIds: string[]) => void;
};

const RightSidebar = (props: Props) => {
  const { chatDetail, currentUser } = props;

  const handleMouseOver = (id: string) => {
    let element: any = document.getElementById('option-' + id);

    if (element.style) {
      element.style.display = 'inline-block';
    }
  };

  const handleMouseLeave = (id: string) => {
    let element: any = document.getElementById('option-' + id);

    if (element.style) {
      element.style.display = 'none';
    }
  };

  const handleMakeOrRemoveAdmin = (id: string) => {
    props.makeOrRemoveAdmin(id);
  };

  const handleAddOrRemoveMember = (id: string) => {
    props.addOrRemoveMember('remove', [id]);
  };

  const renderParticipants = (user: any) => {
    return (
      <ParticipantItem
        key={user._id}
        onMouseOver={() => handleMouseOver(user._id)}
        onMouseLeave={() => handleMouseLeave(user._id)}
      >
        <Link to={`/erxes-plugin-chat?userId=${user._id}`}>
          <Avatar user={user} size={36} />
          <ParticipantDetails>
            {user.details.fullName || user.email}
            <br />
            <ParticipantSubDetails>
              {user.isAdmin ? 'Admin ' : ''}
              {(user.details.position && '- ' + user.details.position) || ''}
            </ParticipantSubDetails>
          </ParticipantDetails>
        </Link>
        <OptionsWrapper id={'option-' + user._id}>
          {user.isAdmin ? (
            <Tip text="Remove as Admin" placement="bottom">
              <OptionsButton onClick={() => handleMakeOrRemoveAdmin(user._id)}>
                <Icon icon="shield-slash" size={14} />
              </OptionsButton>
            </Tip>
          ) : (
            <Tip text="Make admin" placement="bottom">
              <OptionsButton onClick={() => handleMakeOrRemoveAdmin(user._id)}>
                <Icon icon="shield" size={14} />
              </OptionsButton>
            </Tip>
          )}
          <Tip text="Remove user" placement="bottom">
            <OptionsButton onClick={() => handleAddOrRemoveMember(user._id)}>
              <Icon icon="removeuser" size={14} />
            </OptionsButton>
          </Tip>
        </OptionsWrapper>
      </ParticipantItem>
    );
  };

  const renderDirect = () => {
    const users = chatDetail.participantUsers || [];

    const user =
      users.length > 1
        ? users.filter(u => u._id !== currentUser._id)[0]
        : users[0];

    return (
      <DirectWrapper>
        <Avatar user={user} size={64} />
        <h3>{user.details.fullName || user.email}</h3>
        <span>{user.details.position || '-'}</span>
        <hr />
        <DirectDetailItem>
          <p>Description</p>
          <p>{user.details.description || '-'}</p>
        </DirectDetailItem>
        <DirectDetailItem>
          <p>Email</p>
          <p>{user.email || '-'}</p>
        </DirectDetailItem>
        <DirectDetailItem>
          <p>Phone</p>
          <p>{user.details.operatorPhone || '-'}</p>
        </DirectDetailItem>
        <DirectDetailItem>
          <p>Departments</p>
          <p>
            {user.departments
              ? user.departments.map(i => (
                  <span key={i.title}>
                    {i.title}
                    <br />
                  </span>
                ))
              : '-'}
          </p>
        </DirectDetailItem>
        <DirectDetailItem>
          <p>Branches</p>
          <p>
            {user.branches
              ? user.branches.map(i => (
                  <span>
                    {i.title}
                    <br />
                  </span>
                ))
              : '-'}
          </p>
        </DirectDetailItem>
      </DirectWrapper>
    );
  };

  const renderGroup = () => {
    return (
      <>
        <SidebarHeader>
          <h3>{chatDetail.name}</h3>
        </SidebarHeader>
        <Subtitle>Participants</Subtitle>
        <ParticipantList>
          {(chatDetail.participantUsers || []).map(user =>
            renderParticipants(user)
          )}
          <ModalTrigger
            title="Add people"
            trigger={
              <ParticipantItem>
                <a href="#">
                  <Icon
                    icon="plus"
                    size={18}
                    color="black"
                    style={{ margin: '0 0.6em' }}
                  />
                  <ParticipantDetails>Add people</ParticipantDetails>
                </a>
              </ParticipantItem>
            }
            content={props => <AddMember {...props} chatId={chatDetail._id} />}
            hideHeader
            isAnimate
          />
        </ParticipantList>
      </>
    );
  };

  return (
    <CommonSidebar wide={true}>
      <SidebarWrapper>
        {chatDetail.type === 'group' ? renderGroup() : renderDirect()}
      </SidebarWrapper>
    </CommonSidebar>
  );
};

export default RightSidebar;
