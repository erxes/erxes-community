import _ from 'lodash';
import DetailLeftSidebar from './DetailLeftSidebar';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import {
  __,
  FieldStyle,
  SidebarCounter,
  SidebarList,
  Table
} from '@erxes/ui/src';
import { FinanceAmount, FlexRow } from '../../styles';
import { ICustomer } from '@erxes/ui-contacts/src/customers/types';
import { IOverallWorkDet } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import { menuNavs } from '../../constants';
import { withRouter } from 'react-router-dom';
import DetailRightSidebar from './DetailRightSidebar';

type Props = {
  history: any;
  queryParams: any;
  work: IOverallWorkDet;
  errorMsg?: string;
} & IRouterProps;

type State = {};

class OverallWorkDetail extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  displayValue(work, name) {
    const value = _.get(work, name);
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
    const { work, queryParams, history, errorMsg } = this.props;
    if (errorMsg) {
      return (
        <EmptyState
          text={errorMsg.replace('GraphQL error: ', '')}
          size="full"
          image={'/images/actions/11.svg'}
        />
      );
    }
    return <>MainContent</>;
  }

  render() {
    const { queryParams, history, work } = this.props;

    const mainContent = this.renderContent();

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__(`Overall works`)} submenu={menuNavs} />
        }
        leftSidebar={
          <DetailLeftSidebar queryParams={queryParams} history={history} />
        }
        rightSidebar={
          <DetailRightSidebar queryParams={queryParams} work={work} />
        }
        content={mainContent}
      />
    );
  }
}

export default withRouter<IRouterProps>(OverallWorkDetail);
