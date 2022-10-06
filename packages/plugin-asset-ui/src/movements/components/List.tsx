import React from 'react';
import { DefaultWrapper } from '../../common/utils';
import { BarItems, FormControl, Button, router, __, ModalTrigger, Table } from '@erxes/ui/src';
import { IRouterProps } from '@erxes/ui/src/types';
import { ContainerBox } from '../../style';
import { Title } from '@erxes/ui-settings/src/styles';
import Form from '../containers/Form';
import { IMovementType } from '../../common/types';
import Row from './Row';
type Props = {
  movements: IMovementType[];
  loading: boolean;
  refetch: () => void;
} & IRouterProps;
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
  renderRightActionBarButton = (
    <Button btnStyle="success" icon="plus-circle">
      Movement
    </Button>
  );
  renderRightActionBarContent = props => {
    return <Form {...props} />;
  };
  renderRightActionBar = (
    <ModalTrigger
      title="Movement"
      content={this.renderRightActionBarContent}
      trigger={this.renderRightActionBarButton}
      size="xl"
    />
  );

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
    const { movements } = this.props;
    return movements.map(movement => <Row key={movement._id} movement={movement} />);
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

    const leftActionBar = (
      <ContainerBox row>
        <Title>{'All Movements'}</Title>
      </ContainerBox>
    );

    const updatedProps = {
      title: 'Asset Movements',
      rightActionBar,
      leftActionBar,
      content: this.renderList(),
      sidebar: <div>Sidebar</div>
    };

    return <DefaultWrapper {...updatedProps} />;
  }
}

export default List;
