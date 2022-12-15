import SideBar from '../components/SideBar';
import React from 'react';
import { IBranch } from '@erxes/ui/src/team/types';

type Props = {
  history: any;
  currentDate?: string;
  queryParams: any;
  branchesList: IBranch[];
};

const TypesListContainer = (props: Props) => {
  const updatedProps = {
    ...props
  };

  const { userIds } = props.queryParams;
  return <SideBar {...updatedProps} queryUserIds={userIds} />;
};

export default TypesListContainer;
