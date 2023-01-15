import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
// erxes
import Alert from '@erxes/ui/src/utils/Alert';
import CommonSidebar from '@erxes/ui/src/layout/components/Sidebar';
import Spinner from '@erxes/ui/src/components/Spinner';
import confirm from '@erxes/ui/src/utils/confirmation/confirm';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';
import { IUser } from '@erxes/ui/src/auth/types';
// local
import RightSidebar from '../components/RightSidebar';
import { queries, mutations } from '../graphql';

type Props = {
  chatId: string;
};

type FinalProps = {
  currentUser: IUser;
} & Props;

const RightSidebarContainer = (props: FinalProps) => {
  const { chatId, currentUser } = props;
  const [adminMutation] = useMutation(gql(mutations.makeOrRemoveAdminChat));
  const [memberMutation] = useMutation(gql(mutations.addOrRemoveMemberChat));

  const chatDetail = useQuery(gql(queries.chatDetail), {
    variables: { id: chatId },
    fetchPolicy: 'cache-first'
  });

  const makeOrRemoveAdmin = (id: string) => {
    confirm()
      .then(() => {
        adminMutation({
          variables: { id, userId: id }
        })
          .then(() => {
            chatDetail.refetch();
          })
          .catch(error => {
            Alert.error(error.message);
          });
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const addOrRemoveMember = (type: string, userIds: string[]) => {
    confirm()
      .then(() => {
        memberMutation({
          variables: { id: chatId, type, userIds },
          refetchQueries: [{ query: gql(queries.chatDetail) }]
        })
          .then(() => {
            chatDetail.refetch();
          })
          .catch(error => {
            Alert.error(error.message);
          });
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  if (chatDetail.loading) {
    return (
      <CommonSidebar wide={true}>
        <Spinner />
      </CommonSidebar>
    );
  }

  if (chatDetail.error) {
    return <p>{chatDetail.error.message}</p>;
  }

  if (chatDetail.data.chatDetail) {
    return (
      <RightSidebar
        chatDetail={chatDetail.data.chatDetail}
        currentUser={currentUser}
        makeOrRemoveAdmin={makeOrRemoveAdmin}
        addOrRemoveMember={addOrRemoveMember}
      />
    );
  }

  return <></>;
};

const WithCurrentUser = withCurrentUser(RightSidebarContainer);

export default (props: Props) => {
  return <WithCurrentUser {...props} />;
};
