import React, { useEffect, useState } from 'react';
// erxes
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import PageContent from '@erxes/ui/src/layout/components/PageContent';
// local
import LeftSidebar from '../containers/LeftSidebar';
import RightSidebar from '../containers/RightSidebar';
import History from '../containers/History';
import Editor from '../containers/Editor';
import ReplyInfo from '../components/ReplyInfo';

import { ChatContentBody } from '../styles';

type Props = {
  chatId: string;
};

const Chat = (props: Props) => {
  const { chatId } = props;
  const [reply, setReply] = useState<any>(null);

  useEffect(() => setReply(null), [chatId]);

  const renderContent = () => {
    if (chatId) {
      return (
        <PageContent transparent={false} center={true}>
          <ChatContentBody>
            <History chatId={chatId} setReply={setReply} />
            <ReplyInfo reply={reply} setReply={setReply} />
            <Editor chatId={chatId} reply={reply} setReply={setReply} />
          </ChatContentBody>
        </PageContent>
      );
    } else {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h3>Select a chat or start a new conversation</h3>
        </div>
      );
    }
  };

  return (
    <Wrapper
      transparent={true}
      header={
        <Wrapper.Header title={'Chat'} breadcrumb={[{ title: 'Chat' }]} />
      }
      leftSidebar={<LeftSidebar />}
      rightSidebar={<RightSidebar chatId={chatId} />}
      content={renderContent()}
    />
  );
};

export default Chat;
