import {
  __,
  Button,
  ControlLabel,
  DateControl,
  Form,
  FormControl,
  FormGroup,
  MainStyleFormWrapper as FormWrapper,
  MainStyleModalFooter as ModalFooter,
  MainStyleScrollWrapper as ScrollWrapper
} from '@erxes/ui/src';
import { DateContainer } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React from 'react';

import { IPeriodLock, IPeriodLockDoc } from '../types';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  periodLock: IPeriodLock;
  closeModal: () => void;
};

type State = {
  date: Date;
};

class PeriodLockForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { periodLock = {} } = props;

    this.state = {
      date: periodLock.date || new Date()
    };
  }

  generateDoc = (values: { _id: string } & IPeriodLockDoc) => {
    const { periodLock } = this.props;

    const finalValues = values;

    if (periodLock) {
      finalValues._id = periodLock._id;
    }

    return {
      _id: finalValues._id,
      ...this.state,
      date: this.state.date
    };
  };

  renderFormGroup = (label, props) => {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const periodLock = this.props.periodLock || ({} as IPeriodLock);
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    const onChangeStartDate = value => {
      this.setState({ date: value });
    };

    return (
      <>
        <ScrollWrapper>
          <FormWrapper>
            <FormGroup>
              <ControlLabel required={true}>Date</ControlLabel>
              <DateContainer>
                <DateControl
                  {...formProps}
                  required={false}
                  name="date"
                  value={this.state.date}
                  onChange={onChangeStartDate}
                />
              </DateContainer>
            </FormGroup>
          </FormWrapper>
        </ScrollWrapper>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Close
          </Button>

          {renderButton({
            name: 'periodLock',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.periodLock
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default PeriodLockForm;
