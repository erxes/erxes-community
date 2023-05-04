import SideBar from '../../components/sidebar/SideBar';
import React from 'react';
import { IBranch, IDepartment } from '@erxes/ui/src/team/types';

type Props = {
  history: any;
  currentDate?: string;
  queryParams: any;
  branchesList: IBranch[];
  departments: IDepartment[];
};

const TypesListContainer = (props: Props) => {
  const updatedProps = {
    ...props
  };

  return <SideBar {...updatedProps} />;
};

export default TypesListContainer;
