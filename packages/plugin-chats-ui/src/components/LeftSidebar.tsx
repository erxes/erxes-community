import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { convertFromHTML } from 'draft-js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// erxes
import Avatar from '@erxes/ui/src/components/nameCard/Avatar';
import Icon from '@erxes/ui/src/components/Icon';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import CommonSidebar from '@erxes/ui/src/layout/components/Sidebar';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';
import { IUser } from '@erxes/ui/src/auth/types';
// local
import CreateGroupChat from '../containers/modals/CreateGroupChat';
import CreateDirectChat from './modals/CreateDirectChat';
import {
  IconButton,
  Subtitle,
  SidebarWrapper,
  SidebarHeader,
  ContactList,
  ContactGroupAvatar,
  ContactItem,
  ContactWrapper,
  ContactBody,
  ContactContent,
  ContactTimestamp,
  OptionsWrapper,
  OptionsButton,
  OptionsMenuList,
  OptionsMenuItem,
  OptionsMenuWrapper
} from '../styles';

type Props = {
  chats: any[];
  id: string;
  removeChat: (id: string) => void;
  markChatAsRead: (id: string) => void;
};

type FinalProps = {} & Props & { currentUser: IUser };

const LeftSidebar = (props: FinalProps) => {
  dayjs.extend(relativeTime);
  const { chats, id, currentUser } = props;
  const wrapperRef = useRef<any>(null);
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [seenChat, setSeenChat] = useState<boolean>(false);
  const [pinnedChats, setPinnedChats] = useState<any[]>(
    JSON.parse(localStorage.getItem('erxes_pinned_chats') || '[]')
  );

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        wrapperRef.current.style.display = 'none';
        setSelectedChat('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

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

  const handleOptionsClick = (id: string, isSeen: boolean) => {
    let element: any = document.getElementById('option-' + id);
    setSelectedChat(id);
    setSeenChat(isSeen);

    if (wrapperRef && element) {
      let rect = element.getBoundingClientRect();

      wrapperRef.current.style.top = rect.top - 40 + 'px';
      wrapperRef.current.style.left = rect.left - 140 + 'px';
      wrapperRef.current.style.display = 'inline-block';
    }
  };

  const handleHideOptions = () => {
    if (wrapperRef) {
      wrapperRef.current.style.display = 'none';
    }
  };

  const handlePin = (chatId: string) => {
    if (checkPinned(chatId)) {
      updatePinned(pinnedChats.filter(c => c !== chatId));
    } else {
      updatePinned([...pinnedChats, chatId]);
    }
  };

  const updatePinned = (chats: any[]) => {
    setPinnedChats(chats);

    localStorage.setItem('erxes_pinned_chats', JSON.stringify(chats));
  };

  const checkPinned = (chatId: string) => {
    return pinnedChats.indexOf(chatId) !== -1;
  };

  const renderActions = () => {
    return (
      <div>
        <ModalTrigger
          title="Compose"
          trigger={
            <IconButton>
              <Icon icon="pencil" size={12} />
            </IconButton>
          }
          content={props => <CreateDirectChat {...props} />}
          hideHeader
          isAnimate
        />
        <ModalTrigger
          title="Create a group chat"
          trigger={
            <IconButton>
              <Icon icon="users" size={12} />
            </IconButton>
          }
          content={props => <CreateGroupChat {...props} />}
          hideHeader
          isAnimate
        />
      </div>
    );
  };

  const renderChat = (chat: any) => {
    const users = chat.participantUsers || [];
    const user =
      users.length > 1
        ? users.filter(u => u._id !== currentUser._id)[0]
        : users[0];

    const draftContent =
      chat.lastMessage && convertFromHTML(chat.lastMessage.content);

    return (
      <ContactItem
        key={chat._id}
        active={id === chat._id}
        onMouseOver={() => handleMouseOver(chat._id)}
        onMouseLeave={() => handleMouseLeave(chat._id)}
      >
        <Link to={`/erxes-plugin-chat?id=${chat._id}`}>
          {chat.type === 'direct' ? (
            <Avatar user={user} size={36} />
          ) : (
            <ContactGroupAvatar>
              <Avatar user={users[1]} size={24} />
              <Avatar user={users[2]} size={24} />
            </ContactGroupAvatar>
          )}
          <ContactWrapper
            isSeen={
              (chat.lastMessage && chat.lastMessage.createdUser._id) ===
              currentUser._id
                ? true
                : chat.isSeen
            }
          >
            <p>
              {chat.type === 'direct'
                ? user.details.fullName || user.email
                : chat.name}
            </p>
            <ContactBody>
              <ContactContent>
                {draftContent && draftContent.contentBlocks[0].text}
              </ContactContent>
              <ContactTimestamp>
                {chat.lastMessage &&
                  chat.lastMessage.createdAt &&
                  dayjs(chat.lastMessage.createdAt).fromNow()}
              </ContactTimestamp>
            </ContactBody>
          </ContactWrapper>
        </Link>
        <OptionsWrapper
          id={'option-' + chat._id}
          onClick={() => handleOptionsClick(chat._id, chat.isSeen)}
        >
          <OptionsButton>
            <Icon icon="ellipsis-h" size={14} />
          </OptionsButton>
        </OptionsWrapper>
      </ContactItem>
    );
  };

  return (
    <>
      <CommonSidebar wide={true}>
        <SidebarWrapper>
          <SidebarHeader>
            <h3>Chats</h3>
            {renderActions()}
          </SidebarHeader>
          {pinnedChats.length !== 0 && (
            <>
              <Subtitle>Pinned</Subtitle>
              <ContactList>
                {chats.map(chat => checkPinned(chat._id) && renderChat(chat))}
              </ContactList>
            </>
          )}
          <Subtitle>Recent</Subtitle>
          <ContactList>
            {chats.map(chat => !checkPinned(chat._id) && renderChat(chat))}
          </ContactList>
        </SidebarWrapper>
      </CommonSidebar>
      <OptionsMenuWrapper id="options-menu" innerRef={wrapperRef}>
        <OptionsMenuList>
          <OptionsMenuItem
            onClick={() => {
              handlePin(selectedChat), handleHideOptions();
            }}
          >
            {checkPinned(selectedChat) ? 'Unpin' : 'Pin'}
          </OptionsMenuItem>
          <OptionsMenuItem
            onClick={() => {
              props.markChatAsRead(selectedChat), handleHideOptions();
            }}
          >
            {seenChat ? 'Mark as unread' : 'Mark as read'}
          </OptionsMenuItem>
          <OptionsMenuItem
            onClick={() => {
              props.removeChat(selectedChat);
              handleHideOptions();
            }}
          >
            Delete Chat
          </OptionsMenuItem>
        </OptionsMenuList>
      </OptionsMenuWrapper>
    </>
  );
};

const WithCurrentUser = withCurrentUser(LeftSidebar);

export default function(props: Props) {
  return <WithCurrentUser {...props} />;
}
