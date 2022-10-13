import React from 'react';
import { menuMovements } from '../../../common/constant';
import { DefaultWrapper } from '../../../common/utils';
import { Table, __, BarItems, FormControl, router } from '@erxes/ui/src';
import Row from './Row';
import { IMovementItem } from '../../../common/types';
import SideBar from './Sidebar';
type Props = {
  items: IMovementItem[];
  totalCount: number;
  history: any;
  queryParams: any;
};

type State = {
  searchValue: string;
};

class MovementAsset extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;
  constructor(props) {
    super(props);

    this.state = {
      searchValue: props.queryParams.searchValue || ''
    };
  }

  search = e => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });

    this.timer = setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };
  moveCursorAtTheEnd(e) {
    const tmpValue = e.target.value;

    e.target.value = '';
    e.target.value = tmpValue;
  }

  renderRow() {
    const { items } = this.props;
    return items.map(movement => <Row key={movement._id} item={movement} />);
  }

  renderList() {
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Asset Name')}</th>
            <th>{__('Branch')}</th>
            <th>{__('Department')}</th>
            <th>{__('Team Member')}</th>
            <th>{__('Company')}</th>
            <th>{__('Customer')}</th>
            <th>{__('Created At')}</th>
          </tr>
        </thead>
        <tbody>{this.renderRow()}</tbody>
      </Table>
    );
  }

  render() {
    const { totalCount, history, queryParams } = this.props;

    let rightActionBar = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Type to search')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
      </BarItems>
    );

    const updatedProps = {
      title: 'Asset Movement Items',
      subMenu: menuMovements,
      rightActionBar,
      content: this.renderList(),
      sidebar: <SideBar history={history} queryParams={queryParams} />,
      totalCount
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default MovementAsset;
