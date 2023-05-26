import React from 'react';
import {
  Sidebar as CommonSidebar,
  ControlLabel,
  DateControl,
  FormGroup,
  router,
  __
} from '@erxes/ui/src';
import {
  CustomRangeContainer,
  EndDateContainer,
  SidebarHeader
} from '../../styles';
import { DateContainer } from '@erxes/ui/src/styles/main';
import moment from 'moment';

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

class SideBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ...props.queryParams
    };
  }

  render() {
    const { createdAtFrom, createdAtTo } = this.state;

    const handleDate = (field, value) => {
      value = moment(value).format('YYYY/MM/DD hh:mm');
      this.setState({ [field]: value });
      router.setParams(this.props.history, { [field]: value });
      router.setParams(this.props.history, { page: 1 });
    };

    return (
      <CommonSidebar
        full
        header={<SidebarHeader>{__('Additional Filter')}</SidebarHeader>}
      >
        <FormGroup>
          <ControlLabel required={true}>Created Date Range</ControlLabel>
          <CustomRangeContainer>
            <DateContainer>
              <DateControl
                name="createdAtFrom"
                placeholder="Choose start date"
                value={createdAtFrom}
                onChange={e => handleDate('createdAtFrom', e)}
              />
            </DateContainer>
            <EndDateContainer>
              <DateContainer>
                <DateControl
                  name="createdAtTo"
                  placeholder="Choose end date"
                  value={createdAtTo}
                  onChange={e => handleDate('createdAtTo', e)}
                />
              </DateContainer>
            </EndDateContainer>
          </CustomRangeContainer>
        </FormGroup>
      </CommonSidebar>
    );
  }
}

export default SideBar;
