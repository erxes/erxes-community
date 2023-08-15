import ChatList from "../../components/chat/ChatList";
import { IUser } from "../../../auth/types";
import gql from "graphql-tag";
import { queries } from "../../graphql";
import { useQuery } from "@apollo/client";

type Props = {
  currentUser: IUser;
  handleActive?: (chatId: string) => void;
};

const ChatListContainer = (props: Props) => {
  const { currentUser } = props;
  const usersQuery = useQuery(gql(queries.allUsers), {
    variables: {
      isActive: true
    }
  });
  const chatsQuery = useQuery(gql(queries.chats));

  if (usersQuery.loading) {
    return null;
  }

  const users = usersQuery
    ? usersQuery.data?.allUsers.filter((u) => u._id !== currentUser._id)
    : [];

  return (
    <ChatList
      currentUser={currentUser}
      {...props}
      users={users}
      chats={chatsQuery.data?.chats.list || []}
    />
  );
};

export default ChatListContainer;
