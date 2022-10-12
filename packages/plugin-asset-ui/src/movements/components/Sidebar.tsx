import React from 'react';
import {
  Sidebar as CommonSideBar,
  FormGroup as CommonFormGroup,
  ControlLabel,
  DateControl,
  Button,
  Tip,
  Icon,
  router,
  SelectTeamMembers
} from '@erxes/ui/src';
import { ContainerBox } from '../../style';
import { DateContainer } from '@erxes/ui/src/styles/main';
import moment from 'moment';

type Props = {
  history: any;
  queryParams: any;
};

type State = {
  from?: string;
  to?: string;
  userId?: string;
};

export class SideBar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      ...props.queryParams
    };

    this.handleValue = this.handleValue.bind(this);
  }

  handleDate(field, value) {
    value = moment(value).format('YYYY/MM/DD hh:mm');
    this.setState({ [field]: value });
    router.setParams(this.props.history, { [field]: value });
  }

  handleValue(value, name) {
    this.setState({ [name]: value });
    router.setParams(this.props.history, { userId: value });
  }

  render() {
    const { from, to } = this.state;
    const { queryParams, history } = this.props;

    const clearParams = field => {
      this.setState({ [field]: undefined });
      router.removeParams(history, field);
    };

    const FormGroup = ({
      label,
      field,
      clearable,
      children
    }: {
      label: string;
      clearable?: boolean;
      field: string;
      children: React.ReactNode;
    }) => (
      <CommonFormGroup>
        <ContainerBox row spaceBetween>
          <ControlLabel>{label}</ControlLabel>
          {clearable && (
            <Button btnStyle="link" onClick={() => clearParams(field)}>
              <Tip placement="bottom" text="Clear">
                <Icon icon="cancel-1" />
              </Tip>
            </Button>
          )}
        </ContainerBox>
        {children}
      </CommonFormGroup>
    );

    return (
      <CommonSideBar>
        <ContainerBox column gap={5}>
          <FormGroup field="userId" label="Moved User" clearable={queryParams.userId}>
            <SelectTeamMembers
              label="Select Team Member"
              name="userId"
              multi={false}
              onSelect={this.handleValue}
              initialValue={queryParams.userId}
            />
          </FormGroup>
          <FormGroup field="from" label="From" clearable={queryParams?.from}>
            <DateContainer>
              <DateControl
                name="from"
                placeholder="Choose start date"
                value={from}
                onChange={e => this.handleDate('from', e)}
              />
            </DateContainer>
          </FormGroup>
          <FormGroup field="to" label="To" clearable={queryParams?.to}>
            <DateContainer>
              <DateControl
                name="to"
                placeholder="Choose end date"
                value={to}
                onChange={e => this.handleDate('to', e)}
              />
            </DateContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
