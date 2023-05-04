import { periodLockDetailFields } from './queries';

const commonFields = `
  $date: Date,
`;

const commonVariables = `
  date: $date,
`;

const periodLocksAdd = `
  mutation periodLocksAdd(${commonFields}) {
    periodLocksAdd(${commonVariables}) {
      _id
      ${periodLockDetailFields}
    }
  }
`;

const periodLocksEdit = `
  mutation periodLocksEdit($_id: String!, ${commonFields}) {
    periodLocksEdit(_id: $_id, ${commonVariables}) {
      _id
      ${periodLockDetailFields}
    }
  }
`;

const periodLocksRemove = `
  mutation periodLocksRemove($periodLockIds: [String]) {
    periodLocksRemove(periodLockIds: $periodLockIds)
  }
`;

export default {
  periodLocksAdd,
  periodLocksEdit,
  periodLocksRemove
};
