import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { IWork } from '../../types';

type Props = {
  work: IWork;
  history: any;
};

class Row extends React.Component<Props> {
  render() {
    const { work } = this.props;

    const {
      name,
      status,
      job,
      flow,
      product,
      inBranch,
      inDepartment,
      outBranch,
      outDepartment,
      startAt,
      dueDate,
      count,
      intervalId,
      needProducts,
      resultProducts
    } = work;

    return (
      <tr>
        <td>{name}</td>
        <td>{status}</td>
        <td>{job ? job.label : ''}</td>
        <td>{flow ? flow.name : ''}</td>
        <td>{product ? product.name : ''}</td>
        <td>{count || 0}</td>
        <td>{inBranch}</td>
        <td>{inDepartment}</td>
        <td>{outBranch}</td>
        <td>{outDepartment}</td>
        <td>{intervalId}</td>
        <td>{(needProducts || []).length}</td>
        <td>{(resultProducts || []).length}</td>
        <td>{startAt}</td>
        <td>{dueDate.toLocaleString()}</td>
      </tr>
    );
  }
}

export default Row;
