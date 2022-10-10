import React from 'react';
import { Sidebar as CommonSideBar, FormGroup as CommonFormGroup, ControlLabel, DateControl } from '@erxes/ui/src';
import { ContainerBox } from '../../style';
import { DateContainer } from '@erxes/ui/src/styles/main';

type Props = {};

type VariablesType = {
  from?: string;
  to?: string;
};

type State = {
  variables: VariablesType;
};

export class SideBar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      variables: {}
    };
  }

  handleDate(field, value) {
    this.setState(prev => ({ variables: { ...prev.variables, [field]: value } }));
  }
  render() {
    const { variables } = this.state;

    const FormGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
      <CommonFormGroup>
        <ControlLabel>{label}</ControlLabel>
        {children}
      </CommonFormGroup>
    );

    return (
      <CommonSideBar>
        <ContainerBox column gap={5}>
          <FormGroup label="From">
            <DateContainer>
              <DateControl
                name="from"
                placeholder="Choose start date"
                value={variables.from}
                onChange={e => this.handleDate('from', e)}
              />
            </DateContainer>
          </FormGroup>
          <FormGroup label="To">
            <DateContainer>
              <DateControl
                name="to"
                placeholder="Choose end date"
                value={variables.to}
                onChange={e => this.handleDate('to', e)}
              />
            </DateContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
