import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import MailConversation from '@erxes/ui-inbox/src/inbox/components/conversationDetail/workarea/mail/MailConversation';
import * as compose from 'lodash.flowright';
import React from 'react';
import { queries } from '../graphql';

class Detail extends React.Component<any> {
  render() {
    const { currentConversation, messagesQuery } = this.props;

    if (messagesQuery.loading) {
      return null;
    }

    const messages = messagesQuery.viberConversationDetail || [];

    return (
      <MailConversation
        conversation={currentConversation}
        conversationMessages={messages}
      />
    );
  }
}

const WithQuery = compose(
  graphql<any>(gql(queries.detail), {
    name: 'messagesQuery',
    options: ({ currentId }) => {
      return {
        variables: {
          conversationId: currentId
        },
        fetchPolicy: 'network-only'
      };
    }
  })
)(Detail);

export default WithQuery;
