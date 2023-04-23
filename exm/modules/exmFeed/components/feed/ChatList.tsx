import { ContactItem } from "../../styles";
import { IUser } from "../../../auth/types";
import NameCard from "../../../common/nameCard/NameCard";
import React from "react";

type Props = {
  users: IUser[];
};

export default function ChatList({ users }: Props) {
  return users.map((user) => (
    <ContactItem key={user._id}>
      <NameCard user={user} avatarSize={40} singleLine={true} />
    </ContactItem>
  ));
}
