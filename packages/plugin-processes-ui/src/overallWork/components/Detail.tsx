import _ from 'lodash';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import DetailLeftSidebar from './DetailLeftSidebar';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, FieldStyle, SidebarCounter, Table } from '@erxes/ui/src';
import { FinanceAmount, FlexRow } from '../../styles';
import { ICustomer } from '@erxes/ui-contacts/src/customers/types';
import { IOverallWorkDet, IPerform } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import { menuNavs } from '../../constants';
import { withRouter } from 'react-router-dom';
import DetailRightSidebar from './DetailRightSidebar';
import PerformRow from './PerformRow';
import { BarItems } from '@erxes/ui/src/layout/styles';

type Props = {
  history: any;
  queryParams: any;
  overallWork: IOverallWorkDet;
  errorMsg?: string;
  performs: IPerform[];
} & IRouterProps;

type State = {};

class OverallWorkDetail extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  displayValue(overallWork, name) {
    const value = _.get(overallWork, name);
    return <FinanceAmount>{(value || 0).toLocaleString()}</FinanceAmount>;
  }

  renderRow(label, value) {
    return (
      <li>
        <FlexRow>
          <FieldStyle>{__(`${label}`)}:</FieldStyle>
          <SidebarCounter>{value || '-'}</SidebarCounter>
        </FlexRow>
      </li>
    );
  }

  renderEditRow(label, key) {
    const value = this.state[key];
    const onChangeValue = e => {
      this.setState({ [key]: Number(e.target.value) } as any);
    };
    return (
      <li>
        <FlexRow>
          <FieldStyle>{__(`${label}`)}:</FieldStyle>
          <FormControl type="number" onChange={onChangeValue} value={value} />
        </FlexRow>
      </li>
    );
  }

  generateLabel = customer => {
    const { firstName, primaryEmail, primaryPhone, lastName } =
      customer || ({} as ICustomer);

    let value = firstName ? firstName.toUpperCase() : '';

    if (lastName) {
      value = `${value} ${lastName}`;
    }
    if (primaryPhone) {
      value = `${value} (${primaryPhone})`;
    }
    if (primaryEmail) {
      value = `${value} /${primaryEmail}/`;
    }

    return value;
  };

  renderContent() {
    const {
      overallWork,
      queryParams,
      history,
      errorMsg,
      performs
    } = this.props;
    if (errorMsg) {
      return (
        <EmptyState
          text={errorMsg.replace('GraphQL error: ', '')}
          size="full"
          image={'/images/actions/11.svg'}
        />
      );
    }

    return (
      <Table whiteSpace="nowrap" bordered={true} hover={true}>
        <thead>
          <tr>
            <th>{__('Type')}</th>
            <th>{__('Job')}</th>
            <th>{__('Product')}</th>
            <th>{__('Count')}</th>
            <th>{__('In Branch')}</th>
            <th>{__('In Department')}</th>
            <th>{__('Out Branch')}</th>
            <th>{__('Out Department')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="overallWorks">
          {(performs || []).map(perform => (
            <PerformRow
              key={Math.random()}
              perform={perform}
              history={history}
              queryParams={queryParams}
            />
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    const { queryParams, history, overallWork } = this.props;

    const mainContent = this.renderContent();
    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Add performance')}
      </Button>
    );

    // const modalContent = props => <Form {...props} />;
    const modalContent = props => <></>;

    const actionBarRight = (
      <BarItems>
        <ModalTrigger
          title="Add Performance"
          size="lg"
          trigger={trigger}
          autoOpenKey="showProductModal"
          content={modalContent}
        />
      </BarItems>
    );

    const actionBarLeft = <Title>{'All jobs'}</Title>;

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__(`Overall works`)} submenu={menuNavs} />
        }
        actionBar={
          <Wrapper.ActionBar left={actionBarLeft} right={actionBarRight} />
        }
        leftSidebar={
          <DetailLeftSidebar queryParams={queryParams} history={history} />
        }
        rightSidebar={
          <DetailRightSidebar
            queryParams={queryParams}
            overallWork={overallWork}
          />
        }
        content={mainContent}
      />
    );
  }
}

export default withRouter<IRouterProps>(OverallWorkDetail);
