import { IUser } from '@erxes/ui/src/auth/types';

export type IUserCall = IUser & {
  time: string;
  isMissedCall: boolean;
};

export type Operator = {
  userId: string;
  gsUsername: string;
  gsPassword: string;
};
