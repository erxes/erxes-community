import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { colors, dimensions } from '@erxes/ui/src/styles';

export const SidebarWrapper = styled.div`
  height: calc(100% - 10px);
  background-color: ${colors.bgActive};
  padding: 0 1em;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 10px;
`;

export const SidebarHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: ${colors.bgActive};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${dimensions.unitSpacing}px;
`;

export const IconButton = styled.button`
  display: inline-block;
  background-color: ${colors.colorShadowGray};
  margin-left: ${dimensions.unitSpacing}px;
  padding: ${dimensions.unitSpacing}px 14px;
  border-radius: 100%;
  border: 0;
  outline: 0;  
  transition: 0.3s;

  &:hover {
    background-color: ${colors.colorCoreLightGray}
    transition: 0.3s;
    cursor: pointer;
  }
`;

export const Subtitle = styled.h5`
  padding: 0 ${dimensions.unitSpacing}px;
  margin: 0;
  margin-bottom: 6px;
  color: ${colors.textSecondary};
`;

// OptionMenu
export const OptionsMenuWrapper = styled.div`
  position: absolute;
  z-index: 1001;
  display: none;
  top: 100px;
  left: 100px;
  width: auto;
  height: auto;
  background-color: white;
  box-shadow: 0 0 ${dimensions.unitSpacing}px 0 rgba(0, 0, 0, 0.2);
  border-radius: ${dimensions.unitSpacing}px;
  padding: 0.5em;
`;

export const OptionsMenuList = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-top;
  flex-direction: column;
`;

export const OptionsMenuItem = styled.button`
  width: 100%;
  background-color: white;
  border: 0;
  outline: 0;
  border-radius: ${dimensions.unitSpacing}px;
  padding: 1em;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${colors.bgActive};
  }
`;

export const OptionsButton = styled.button`
  display: inline-block;
  color: white;
  background-color: ${colors.colorPrimary};
  margin-left: ${dimensions.unitSpacing}px;
  padding: 0.4em 0.7em;
  border-radius: 100%;
  border: 0;
  outline: 0;
  transition: 0.3s;
  pointer-events: auto;

  &:hover {
    background-color: ${colors.colorPrimaryDark}
    transition: 0.3s;
    cursor: pointer;
  }
`;

export const OptionsWrapper = styled.div`
  z-index: 1000;
  display: none;

  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
`;

/**
 * Chat Contacts
 */
export const ContactList = styled.div`
  max-height: 100%;
  list-style: none;
  margin: 0;
  padding-left: 0;
  margin-bottom: 10px;
`;

export const ContactItem = styledTS<{ active?: boolean }>(styled.div)`
  position: relative;
  background-color: ${props => (props.active ? colors.bgGray : 'initial')};
  border-radius: ${dimensions.unitSpacing}px;
  padding: ${dimensions.unitSpacing}px;
  transition: 0.2s;
  
  &:hover {
    background-color: ${colors.bgGray};
    transition: 0.2s;
  }
  
  a {
    display: flex;
    align-items: center;
  }
`;

export const ContactWrapper = styledTS<{ isSeen?: boolean }>(styled.div)`
  width: 100%;
  padding: 0 ${dimensions.unitSpacing}px;
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 14px !important;
  font-weight: ${props => (props.isSeen ? 'normal !important' : 'bold')};
  text-decoration: none;

  p { margin: 0 };
`;

export const ContactGroupAvatar = styled.div`
  position: relative;
  min-width: 36px;
  max-width: 36px;
  height: 36px;

  span:first-child {
    position: absolute;
    bottom: -2px;
    left: -2px;
    border: 2px solid ${colors.bgActive};
    z-index: 1;
  }
  span:last-child {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

export const ContactBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 12px;
`;

export const ContactContent = styled.p`
  max-width: 150px;
  max-height: 1rem;
  overflow: hidden;

  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-word;
`;

export const ContactTimestamp = styled.span`
  flex-shrink: 0;
  text-align: right;
`;

/**
 * Participants
 */
export const ParticipantList = styled.div`
  max-height: 100%;
  list-style: none;
  margin: 0;
  padding-left: 0;
`;

export const ParticipantItem = styled.div`
  position: relative;

  a {
    display: flex;
    align-items: center;
    padding: ${dimensions.unitSpacing}px;
    border-radius: ${dimensions.unitSpacing}px;
    transition: 0.2s;
  }

  a:hover {
    background-color: ${colors.bgGray};
    transition: 0.2s;
  }
`;

export const ParticipantDetails = styled.div`
  width: 100%;
  padding: 0 ${dimensions.unitSpacing}px;
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 14px;
  text-decoration: none;
`;

export const ParticipantSubDetails = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

/**
 * Chat Content
 */
export const ChatContentBody = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

/**
 * Message List
 */
export const MessageList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  background-color: #f9f9f9;
  border-top-left-radius: ${dimensions.unitSpacing}px;
  border-top-right-radius: ${dimensions.unitSpacing}px;
  overflow-y: scroll;
  overflow-x: hidden;
  list-style: none;
  padding: 20px ${dimensions.unitSpacing}px;
  margin: 0;
`;

export const MessageItem = styledTS<{ me: boolean }>(styled.div)`
  max-width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: ${props => (props.me ? 'flex-start' : 'flex-end')};
  flex-direction: ${props => (props.me ? 'row' : 'row-reverse')};
  margin: ${dimensions.unitSpacing}px;

  &:last-child {
    margin-top: auto;
  }
`;

export const MessageWrapper = styledTS<{ me?: boolean }>(styled.div)`
  max-width: 560px;
  display: flex;
  align-items: ${props => (props.me ? 'flex-end' : 'flex-start')};
  justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
  flex-direction: column;
  overflow: hidden;
  margin: 0 ${dimensions.unitSpacing}px;
`;

export const MessageReply = styled.div`
  max-width: 100%;
  display: inline-block;

  font-size: 0.8em;
  color: ${colors.textSecondary};
  background-color: ${colors.bgUnread}
  border-radius: ${dimensions.unitSpacing}px;
  padding: 2px ${dimensions.unitSpacing}px 2px;
  margin: 0;

  p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-word;
  }
`;

export const MessageBody = styledTS<{ me?: boolean }>(styled.div)`
  max-width: 560px;
  display: flex;
  justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
  flex-direction: ${props => (props.me ? 'row' : 'row-reverse')};
`;

export const MessageContent = styledTS<{ me?: boolean }>(styled.div)`
  max-width: 100% !important;
  display: inline-block;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;

  border-radius: ${dimensions.unitSpacing}px;
  background-color: ${props =>
    props.me ? colors.colorPrimary : colors.bgGray};
  color: ${props => (props.me ? 'white' : 'initial')};
  padding: 8px;
  margin: 0;

  p {
    margin: 0;
  }
`;

export const MessageOption = styled.button`
  background: none;
  display: inline-block;
  visibility: hidden;
  border-radius: 100%;
  border: 0;
  outline: 0;
  cursor: pointer;
  margin: auto ${dimensions.unitSpacing}px;

  &:hover {
    background-color: ${colors.bgGray};
  }
`;

export const ChatEditor = styled.div`
  height: auto;
  width: 100%;
  bottom: 0;
  margin-bottom: 10px;

  & > span {
    font-size: 10px;
    color: ${colors.textSecondary};
  }

  & > p {
    margin: 0;
  }

  .cke {
    border: 0;
  }

  .cke_toolgroup {
    border: 0;
  }

  .cke_top {
    border: 0;
    background-color: white;
    background-image: none !important;
  }

  .cke_bottom {
    display: none;
  }
`;

export const ChatReplyInfo = styled.div`
  max-width: 100%;
  height: auto;
  display: block;
  overflow: hidden;
  font-size: ${dimensions.unitSpacing}px;
  color: ${colors.textSecondary};
  margin: 0;
  padding 1em 0;

  p {
    max-width: 560px;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-word;
  }
`;

/**
 * Direct Info
 */
export const DirectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 3em 0;

  h3,
  span {
    margin-bottom: 0.2em;
    text-align: center;
  }
  hr {
    width: 100%;
    border-color: ${colors.colorShadowGray};
  }
`;

export const DirectDetailItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  & p:last-child {
    text-align: right;
  }
`;
