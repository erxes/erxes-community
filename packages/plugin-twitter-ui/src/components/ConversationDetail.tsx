import React from 'react';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { __ } from 'coreui/utils';
import SimpleMessage from '@erxes/ui-inbox/src/inbox/components/conversationDetail/workarea/conversation/messages/SimpleMessage';
import { queries } from '../graphql';

class Detail extends React.Component<any> {
  render() {
    const { messagesQuery } = this.props;

    if (messagesQuery.loading) {
      return null;
    }

    const messages = messagesQuery.twitterConversationDetail || [];

    return messages.map(message => {
      const isSameUser = false;
      if (message.data.customer) {
        const isStaff = false;
        return (
          <SimpleMessage
            message={message.data}
            isStaff={isStaff}
            isSameUser={isSameUser}
          />
        );
      }
      const isStaff = true;

      return (
        <SimpleMessage
          message={message.data}
          isStaff={isStaff}
          isSameUser={isSameUser}
        />
      );
    });
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
