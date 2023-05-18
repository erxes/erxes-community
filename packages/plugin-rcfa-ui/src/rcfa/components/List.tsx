import React from 'react';
import { HeaderDescription, Table, __ } from '@erxes/ui/src/';
import { DefaultWrapper } from '../../common/utils';
import SideBar from './Sidebar';

import Row from './Row';

type Props = {
  list: any[];
  history: any;
  queryParams: any;
};

type State = {
  searchValue?: string;
};

class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRow(item) {
    const updatedProps = {
      item
    };

    return <Row {...updatedProps} />;
  }

  renderContent() {
    const { list, history, queryParams } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Source Type')}</th>
            <th>{__('Source Name')}</th>
            <th>{__('Type')}</th>
            <th>{__('Name')}</th>
            <th>{__('Created at')}</th>
            <th>{__('Closed at')}</th>
            {/* <th>{__('Action')}</th> */}
          </tr>
        </thead>
        <tbody>{list.map(item => this.renderRow(item))}</tbody>
      </Table>
    );
  }

  render() {
    const { history, queryParams } = this.props;

    const leftActionBar = (
      <HeaderDescription
        title="RCFA List"
        icon="/images/actions/8.svg"
        description=""
      />
    );

    const updatedProps = {
      title: 'RCFA list',
      leftActionBar,
      totalCount: 0,
      sidebar: <SideBar history={history} queryParams={queryParams} />,
      content: this.renderContent()
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
