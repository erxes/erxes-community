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
  SelectTeamMembers,
  __
} from '@erxes/ui/src';
import { ContainerBox } from '../../style';
import { DateContainer, FormColumn, FormWrapper } from '@erxes/ui/src/styles/main';
import moment from 'moment';
import { Title } from '@erxes/ui-settings/src/styles';

type Props = {
  history: any;
  queryParams: any;
};

type State = {
  movedAtFrom?: string;
  movedAtTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
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
    const { createdAtFrom, createdAtTo, movedAtFrom, movedAtTo } = this.state;
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
          <FormGroup
            field="createdAtFrom"
            label="Created At From"
            clearable={queryParams?.createdAtFrom}
          >
            <DateContainer>
              <DateControl
                name="createdAtFrom"
                placeholder="Choose start date"
                value={createdAtFrom}
                onChange={e => this.handleDate('createdAtFrom', e)}
              />
            </DateContainer>
          </FormGroup>
          <FormGroup field="createdAtTo" label="Created At To" clearable={queryParams?.createdAtTo}>
            <DateContainer>
              <DateControl
                name="createdAtTo"
                placeholder="Choose end date"
                value={createdAtTo}
                onChange={e => this.handleDate('createdAtTo', e)}
              />
            </DateContainer>
          </FormGroup>

          <FormGroup field="movedAtFrom" label="Moved At From" clearable={queryParams?.movedAtFrom}>
            <DateContainer>
              <DateControl
                name="movedAtFrom"
                placeholder="Choose start date"
                value={movedAtFrom}
                onChange={e => this.handleDate('movedAtFrom', e)}
              />
            </DateContainer>
          </FormGroup>
          <FormGroup label="Moved At To" field="movedAtTo" clearable={queryParams?.movedAtTo}>
            <DateContainer>
              <DateControl
                name="movedAtTo"
                placeholder="Choose end date"
                value={movedAtTo}
                onChange={e => this.handleDate('movedAtTo', e)}
              />
            </DateContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
