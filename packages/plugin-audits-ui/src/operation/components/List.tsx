import { BarItems, Button, FormControl, ModalTrigger, Spinner, Table, __ } from '@erxes/ui/src';
import Bulk, { IBulkContentProps } from '@erxes/ui/src/components/Bulk';
import { IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { DefaultWrapper } from '../../common/utils';
import { IOperations } from '../common/types';
import FormContainer from '../containers/Form';
import Row from './Row';
import SideBar from './SideBar';

type Props = {
  queryParams: IQueryParams;
  list: IOperations[];
  totalCount: number;
  loading: boolean;
} & IRouterProps &
  IBulkContentProps;

class List extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.renderList = this.renderList.bind(this);
  }

  renderForm() {
    const trigger = <Button btnStyle="success">Add Operations</Button>;

    const content = props => {
      const updatedProps = {
        ...props,
        ...this.props
      };

      return <FormContainer {...updatedProps} />;
    };

    return <ModalTrigger content={content} trigger={trigger} title="Add Operation" />;
  }

  renderList() {
    const { list, totalCount, loading } = this.props;
    if (!list || loading) {
      return <Spinner />;
    }
    return (
      <Table>
        <thead>
          <tr>
            <th>{list && <FormControl componentClass="checkbox" />}</th>
            <th>{__('Name')}</th>
            <th>{__('Code')}</th>
            <th>{__('Created At')}</th>
          </tr>
        </thead>
        <tbody>
          {list.map(item => {
            {
              return <Row operation={item} key={item._id} />;
            }
          })}
        </tbody>
      </Table>
    );
  }

  render() {
    const { loading, totalCount } = this.props;

    let rightActionBar = <BarItems>{this.renderForm()}</BarItems>;

    const updatedProps = {
      title: 'Operations',
      rightActionBar,
      content: <Bulk content={this.renderList} />,
      sidebar: <SideBar {...this.props} />,
      loading,
      totalCount
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
