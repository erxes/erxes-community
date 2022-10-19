import {
  Button,
  ControlLabel,
  DateControl,
  FormGroup as CommonFormGroup,
  Icon,
  router,
  SelectTeamMembers,
  Sidebar as CommonSideBar,
  Tip
} from '@erxes/ui/src';
import { DateContainer } from '@erxes/ui/src/styles/main';
import moment from 'moment';
import React from 'react';
import { ContainerBox, CustomRangeContainer, EndDateContainer } from '../../style';

type Props = {
  history: any;
  queryParams: any;
};

type State = {
  movedAtFrom?: string;
  movedAtTo?: string;
  modifiedAtFrom?: string;
  modifiedAtTo?: string;
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
    const {
      createdAtFrom,
      createdAtTo,
      movedAtFrom,
      movedAtTo,
      modifiedAtFrom,
      modifiedAtTo
    } = this.state;
    const { queryParams, history } = this.props;

    const clearParams = field => {
      if (Array.isArray(field)) {
        field.forEach(name => {
          this.setState({ [name]: undefined });
          return router.removeParams(history, name);
        });
      }
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
      field: string | string[];
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
            label="Created Date Range"
            field={['createdAtFrom', 'createdAtTo']}
            clearable={queryParams?.createdAtFrom || queryParams?.createdAtTo}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="createdAtFrom"
                  placeholder="Choose start date"
                  value={createdAtFrom}
                  onChange={e => this.handleDate('createdAtFrom', e)}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="createdAtTo"
                    placeholder="Choose end date"
                    value={createdAtTo}
                    onChange={e => this.handleDate('createdAtTo', e)}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
          <FormGroup
            label="Moved Date Range"
            field={['movedAtFrom', 'movedAtTo']}
            clearable={queryParams?.movedAtFrom || queryParams?.movedAtTo}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="movedAtFrom"
                  placeholder="Choose start date"
                  value={movedAtFrom}
                  onChange={e => this.handleDate('movedAtFrom', e)}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="movedAtTo"
                    placeholder="Choose end date"
                    value={movedAtTo}
                    onChange={e => this.handleDate('movedAtTo', e)}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
          <FormGroup
            label="Modified Date Range"
            field={['modifiedAtFrom', 'modifiedAtTo']}
            clearable={queryParams?.modifiedAtFrom || queryParams?.modifiedAtTo}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="modifiedAtFrom"
                  placeholder="Choose start date"
                  value={modifiedAtFrom}
                  onChange={e => this.handleDate('modifiedAtFrom', e)}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="modifiedAtTo"
                    placeholder="Choose end date"
                    value={modifiedAtTo}
                    onChange={e => this.handleDate('modifiedAtTo', e)}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}
