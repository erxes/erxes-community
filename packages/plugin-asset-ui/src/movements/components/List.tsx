import React from 'react';
import { DefaultWrapper } from '../../common/utils';
import { BarItems, FormControl, Button, router, __ } from '@erxes/ui/src';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {} & IRouterProps;
type State = {
  searchValue: string;
};

class List extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;
  constructor(props) {
    super(props);

    this.state = {
      searchValue: ''
    };
  }

  renderRightActionBar = (<Button btnStyle="success" icon="plus-circle"></Button>);

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

  render() {
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
        {this.renderRightActionBar}
      </BarItems>
    );

    const updatedProps = {
      title: 'Asset Movements',
      rightActionBar,
      content: <div>List</div>,
      sidebar: <div>Sidebar</div>
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
