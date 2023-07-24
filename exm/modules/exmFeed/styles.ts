import { colors, dimensions } from '../styles';

import { UploadBtn } from '../common/Uploader';
import { rgba, darken } from '../styles/ecolor';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

export const FeedLayout = styled.div`
  flex: 1;

  p {
    margin-bottom: 0;
    color: #666;
  }

  .hxZkUW {
    justify-content: center;

    > span {
      min-width: 120px;
      text-align: center;
    }
  }
`;

export const Row = styled.div`
  display: flex;

  .Select {
    flex: 1;
  }

  button {
    flex-shrink: 0;
    margin-left: 10px;
    align-self: baseline;
  }
`;

export const TabContent = styled.div`
  margin: 20px auto;
`;

export const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const UploadItems = styled.div`
  margin-bottom: ${dimensions.coreSpacing}px;
  display: flex;

  > div {
    ${UploadBtn} {
      label {
        border: 1px dashed #d9d9d9;
        background: ${rgba(colors.bgMain, .6)};
        padding: 30px ${dimensions.headerSpacing}px;
        border-radius: ${dimensions.unitSpacing}px;
        margin-right: ${dimensions.coreSpacing}px;
        color: ${colors.colorCoreGray};
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all ease .3s;
        font-size: 13px;
        
        &:hover {
          border-color: ${colors.colorCoreBlueGray};
        }

        i {
          color: ${colors.colorSecondary};
        }
      }
    }
  }
`;

export const NewsFeedLayout = styled.div`
  margin-top: ${dimensions.coreSpacing}px;
  
  > div {
    margin-bottom: 20px;
    border-radius: 10px;
    background: ${colors.colorWhite};
    border: 1px solid ${colors.borderPrimary};
    
    > img {
      width: 100%;
      border-top: 1px solid #ddd;
    }
  }

  > button {
    border: 1px solid #ddd;
    margin-bottom: 20px;
    &:hover {
      background: rgba(10, 30, 65, 0.08);
    }
  }
`;

export const OverflowWrapper = styled.div`
  overflow: auto;
  position: relative;
  flex: 1;
  max-height: 100vh;
`;

export const HeaderFeed = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;

  > div {
    > div {
      > p {
        > b {
          color: green;
        }
      }
    }

    > img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
`;

export const NavItem = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all ease 0.3s;

  &:hover {
    background-color: #ddd;
    cursor: pointer;
  }

  .dropdown {
    display: table;
    text-align: center;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;

    div:first-child {
      display: table-cell;
      vertical-align: middle;
      height: 100%;
    }
  }

  .dropdown-menu {
    min-width: 150px;

    > li,
    > li a {
      height: 30px;
      line-height: 2;
    }
  }
`;

export const FeedActions = styledTS<{ showPin?: boolean | undefined }>(
  styled.div
)`
  display: flex;
  align-items: center;

  > i {
    visibility: ${props => (props.showPin ? 'visible' : 'hidden')};
    color: #e91e27
  }
`;

export const TextFeed = styled.div`
  padding: 0 20px 15px;
`;

export const LikeCommentShare = styled.div`
  display: flex;
  border-top: 1px solid ${colors.borderPrimary};
  padding: 10px 20px;

  b {
    margin-right: 20px;
  }
  b:last-of-type {
    margin-left: auto;
    margin-right: 0px;
  }
`;

export const Attachments = styled.div`
  border-top: 1px solid #ddd;
  color: #444;
  font-size: 14px;
  padding: 10px;

  &:hover {
    background: rgba(10, 30, 65, 0.08);
  }
`;

export const CustomRangeContainer = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: flex-end;

  > span {
    flex: 1;
    margin-right: 8px;

    input[type='text'] {
      border: none;
      width: 100%;
      height: 34px;
      padding: 5px 0;
      color: #444;
      border-bottom: 1px solid;
      border-color: #ddd;
      background: none;
      border-radius: 0;
      box-shadow: none;
      font-size: 13px;
    }
  }
`;

export const FormWrap = styledTS<{ transparent?: boolean }>(styled.div)`
  form {
    padding: 10px 20px;
    background: ${props => !props.transparent && '#f4f4f7'};
    border-radius: 10px;
    border: ${props => !props.transparent && '1px solid #eee'} ;
    margin-bottom: 20px;

    > span,
    .Select {
      display: block;
      margin-bottom: 10px;
    }

    label {
      margin-right: 20px;
    }
  }
`;

export const Col = styledTS<{ width?: number }>(styled.div)`
  width: ${props => (props.width ? props.width : 25)}%;
  padding: ${dimensions.coreSpacing}px;
`;

export const AvatarImg = styled.img`
  width: ${dimensions.coreSpacing + 6}px;
  height: ${dimensions.coreSpacing + 6}px;
  line-height: ${dimensions.coreSpacing + 6}px;
  border-radius: ${(dimensions.coreSpacing + 6) / 2}px;
  vertical-align: middle;
  background: ${colors.bgActive};
  margin-right: ${dimensions.unitSpacing}px;
`;

export const CreateFormContainer = styled.div`
  background: ${colors.colorWhite};
  border-radius: 12px;
  border: 1px solid ${colors.borderPrimary};
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${dimensions.coreSpacing}px;
`;

export const CreateInput = styled.div`
  border: 1px solid ${colors.borderPrimary};
  border-radius: ${dimensions.coreSpacing}px;
  color: ${colors.colorCoreBlueGray};
  flex: 1;
  font-size: 14px;
  margin-left: ${dimensions.coreSpacing}px;
  height: ${dimensions.headerSpacing - dimensions.unitSpacing}px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  transition: all ease .3s;

  &:hover {
    background: ${colors.bgMain};
  }
`;

export const AdditionalInfo = styled(FlexRow)`
  border-top: 1px solid ${colors.borderPrimary};
  padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;
  color: ${colors.colorCoreBlueGray};
  font-size: 13px;
  flex: 1;

  i {
    margin-right: ${dimensions.unitSpacing}px;
  }
`;

export const AdditionalItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all ease .3s;

  &:hover {
    color: ${colors.textSecondary};
  }
`;

export const Card = styled.div`
  background: ${colors.colorWhite};
  border: 1px solid ${colors.borderPrimary};
  padding: ${dimensions.coreSpacing}px;
  margin: 0 ${dimensions.coreSpacing}px ${dimensions.coreSpacing}px;
  border-radius: 12px;

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: ${dimensions.unitSpacing}px;
  }

  &:last-child {
    margin-bottom: 100px;
  }
`;

export const LearnWrapper = styled.div`
  background: ${colors.colorWhite};
  border-radius: 12px;
  flex: 1;
  margin: ${dimensions.coreSpacing}px;
  padding: ${dimensions.coreSpacing}px;
  font-size: 14px;
  overflow: auto;

  p, span {
    color: ${colors.colorCoreBlueGray};
  }

  h5 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: ${dimensions.unitSpacing - 5}px;
  }
`;

export const OverflowRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: ${dimensions.unitSpacing}px 0;
`;

export const LearnBanner = styled.div`
  border-radius: 12px;
  height: 250px;
  margin-bottom: ${dimensions.coreSpacing}px;
  overflow: hidden;
  position: relative;

  .content {
    padding: 30px;
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;

    h5 {
      font-weight: 600;
    }

    p {
      font-size: 14px;
    }

    a {

    }

    h5, p, a {
      color: ${rgba(colors.colorWhite, .9)};
    }
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%);
  }

  > div {
    background-size: cover;
    background-size: cover;
    height: 100%;
    background-position: center;
  }
`;

export const LearnItem = styled.div`
  width: 32%;
  margin: 0 ${dimensions.coreSpacing}px ${dimensions.coreSpacing + dimensions.coreSpacing}px 0;
  overflow: hidden;

  &:nth-child(3n) {
    margin-right: 0;
  }

  .image-wrapper {
    height: 200px;
    width: 100%;
    overflow: hidden;
    position: relative;
    border-radius: 12px;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }


    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%);
    }
  }
`;

export const LearnItemDescription = styled.div`
  padding: ${dimensions.coreSpacing}px ${dimensions.unitSpacing}px 0;
  height: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    font-size: 13px;
    margin-bottom: ${dimensions.unitSpacing}px;
    display: block;
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      background: ${colors.colorWhite};
      color: ${colors.colorPrimaryDark} !important;
      border-radius: 12px;
      border: 1px solid ${colors.colorPrimaryDark};

      &:hover {
        color: ${colors.colorWhite} !important;
      }

      &:focus {
        outline: 0;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;

      li {
        img {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          display: inline-block;
          border: 2px solid rgb(255, 255, 255);
          margin-left: -10px;
        }
      }
    }
  }
`;

export const SingleEvent = styled.div`
  display: flex;
  align-items: center;
  
  .image-wrapper {
    overflow: hidden;
    width: 70px;
    height: 60px;
    flex-shrink: 0;
    border-radius: ${dimensions.unitSpacing}px;
    margin-right: ${dimensions.unitSpacing}px;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  i {
    margin-right: ${dimensions.unitSpacing}px;
    color: ${colors.colorPrimaryDark};
  }

  b {
    font-size: 14px;
    display: block;
    line-height: 15px;
    margin-bottom: 3px;
  }

  span {
    font-size: 12px;
    text-transform: uppercase;
    color: ${colors.colorCoreGray};
  }
`;

export const ChatItemWrapper = styledTS<{
  active?: boolean;
  isWidget?: boolean;
}>(styled.div)`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${props => (props.active ? colors.bgGray : 'initial')};
  padding: ${dimensions.unitSpacing}px 0;
  transition: 0.2s;

  &:first-child {
    border-top: ${props =>
      props.isWidget && `1px solid ${colors.borderPrimary}`};
  }

  &:hover {
    background-color: ${props =>
      props.isWidget ? colors.bgLight : colors.bgGray};
    cursor: pointer;
    transition: 0.2s;
  }
`;

export const ChatGroupAvatar = styled.div`
  position: relative;
  min-width: 36px;
  max-width: 36px;
  height: 36px;

  span:first-child {
    position: absolute;
    bottom: -2px;
    left: -2px;
    border: 2px solid ${colors.colorWhite};
    z-index: 2;
  }

  span:last-child {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

export const ChatWrapper = styledTS<{ isSeen?: boolean }>(styled.div)`
  width: 100%;
  padding-left: ${dimensions.unitSpacing}px;
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 14px !important;
  font-weight: ${props => (props.isSeen ? 'normal !important' : 'bold')};
  text-decoration: none;

  p { margin: 0 };
`;

export const ChatActions = styled.div`
  z-index: 1;
  visibility: hidden;

  position: absolute;
  right: ${dimensions.coreSpacing}px;
  top: 50%;
  transform: translateY(-50%);
`;

export const ChatActionItem = styled.button`
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

export const ContextMenuList = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-top;
  flex-direction: column;
  padding: 0.5em;
`;

export const ContextMenuItem = styledTS<{ color?: string }>(styled.button)`
  width: 100%;
  background-color: white;
  border: 0;
  outline: 0;
  border-radius: 5px;
  color: ${props => props.color || colors.textPrimary};
  padding: 1em;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${colors.bgActive};
  }
`;

export const WidgetChatWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  z-index: 9999;
  justify-content: flex-end;
  align-content: flex-end;
`;

export const WidgetChatWindowWrapper = styled.div`
  position: relative;
  width: 350px;
  max-height: 400px;
  margin: 0 ${dimensions.coreSpacing / 2}px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  border-radius: 5px;
  overflow: hidden;
  background-color: #f9f9f9;

  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0.5);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
`;

export const WidgetChatWindowHeader = styled.div`
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: ${dimensions.unitSpacing}px;
  border-bottom: 2px solid ${colors.borderPrimary};

  i {
    cursor: pointer;
    margin: 0 ${dimensions.unitSpacing}px;
  }
  div {
    display: flex;
    align-items: center;

    p {
      display: inline-block;
      font-weight: bold;
      display: flex;
      align-items: center;
      margin: 0;
      margin-left: ${dimensions.unitSpacing}px;
      line-height: 15px;
    }
  }
`;

export const ChatReplyInfo = styled.div`
  width: 100%;
  height: auto;
  display: block;
  overflow: hidden;
  font-size: ${dimensions.unitSpacing}px;
  color: ${colors.textSecondary};
  margin: 0;
  padding 1em;

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

export const AttachmentIndicator = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin: ${dimensions.unitSpacing}px 0;
  color: ${rgba(colors.colorWhite, 0.7)};
`;

export const Attachment = styled.div`
  display: flex;
  max-width: 250px;
  padding: 5px;
  margin: 0 5px;
  font-size: 12px;
  background-color: ${colors.colorSecondary};
  align-items: center;

  &:first-child {
    margin-left: 0px;
  }

  > div {
    margin-right: 8px;
  }

  i {
    color: ${colors.colorWhite};
    opacity: 0.7;
    margin: 0 3px;
    font-size: 13px;
    transition: all ease 0.3s;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
`;

export const AttachmentThumb = styled.div`
  margin-right: 5px;
`;

export const PreviewImg = styled.div`
  width: 26px;
  height: 26px;
  background-size: cover;
  background-position: 50%;
`;

export const FileName = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: ${colors.colorWhite};
`;

export const ChatEditor = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  padding: ${dimensions.unitSpacing}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${dimensions.unitSpacing}px;

  label {
    margin: 0 10px;
    display: block;

    &:hover {
      cursor: pointer;
      color: ${darken(colors.colorCoreGray, 30)};
    }
  }

  i {
    margin: 0;
  }

  input[type='file'] {
    display: none;
  }
`;

export const MessageListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  background-color: #f9f9f9;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
  list-style: none;
  padding: 0 ${dimensions.unitSpacing}px;
  margin: 0;
`;

export const MessageItemWrapper = styledTS<{ me?: boolean }>(styled.div)`
  max-width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: ${props => (props.me ? 'flex-start' : 'flex-end')};
  flex-direction: ${props => (props.me ? 'row' : 'row-reverse')};
  margin: 2px;

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
  margin: 0;
  margin-left: ${props => (!props.me ? dimensions.unitSpacing : 0)}px;
`;

export const MessageReply = styled.div`
  max-width: 100%;
  display: inline-block;

  font-size: 0.8em;
  color: ${colors.textSecondary};
  background-color: ${colors.bgUnread}
  border-radius: 5px;
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
  align-items: ${props => (props.me ? 'flex-end' : 'flex-start')};
  flex-direction: ${props => (props.me ? 'row' : 'row-reverse')};
`;

export const MessageContent = styledTS<{ me?: boolean }>(styled.div)`
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;

  border-radius: 5px;
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
  border-radius: 100%;
  border: 0;
  outline: 0;
  cursor: pointer;
  margin: auto ${dimensions.unitSpacing}px;

  &:hover {
    background-color: ${colors.bgGray};
  }
`;

export const MessageAttachmentWrapper = styled.div`
  max-width: 560px;
  height: auto;
  overflow: hidden;
  position: relative;

  & img {
    width: 100%;
    height: auto;
    object-fit: contain;
    right: 0;
  }
`;

export const IconButton = styled.button`
  display: inline-block;
  background-color: transparent;
  margin-left: ${dimensions.unitSpacing}px;
  border-radius: 100%;
  border: 0;
  outline: 0;  
  transition: 0.3s;

  &:hover {
    background-color: ${colors.colorCoreLightGray}
    transition: 0.3s;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

export const GroupChatModal = styled.div`
  h3 {
    font-size: 24px;
  }

  input {
    border: none;
    border-bottom: 1px solid #E2E8F0;
    border-radius: 0;
    padding: 1.5em 0;
  }
`;