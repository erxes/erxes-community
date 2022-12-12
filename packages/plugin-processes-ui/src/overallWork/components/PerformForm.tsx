import Box from '@erxes/ui/src/components/Box';
import Button from '@erxes/ui/src/components/Button';
import CommonForm from '@erxes/ui/src/components/form/Form';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import moment from 'moment';
import React from 'react';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import { __ } from '@erxes/ui/src/utils';
import {
  DateContainer,
  FormColumn,
  FormWrapper,
  ModalFooter
} from '@erxes/ui/src/styles/main';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { IOverallWorkDet, IPerform } from '../types';
import { IProductsData } from '../../types';
import { JOB_TYPE_CHOISES } from '../../constants';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  perform?: IPerform;
  overallWorkDetail: IOverallWorkDet;
  max?: number;
};

type State = {
  type: string;
  count: number;
  date: Date;
  needProducts: IProductsData[];
  resultProducts: IProductsData[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { overallWorkDetail } = this.props;

    this.state = {
      date: new Date(),
      count: 1,
      type: overallWorkDetail?.key.type || '',
      needProducts: overallWorkDetail?.needProducts || [],
      resultProducts: overallWorkDetail?.resultProducts || []
    };
  }

  renderView = (name: string, variable: string) => {
    const defaultName = '-';

    return (
      <li key={Math.random()}>
        <FieldStyle>{__(name)}</FieldStyle>
        <SidebarCounter>{variable || defaultName}</SidebarCounter>
      </li>
    );
  };

  renderProducts = (name: string, products: any[], realDatas: any[]) => {
    const result: React.ReactNode[] = [];

    result.push(
      <li>
        <FieldStyle>{__(name)}</FieldStyle>
        <SidebarCounter>{(products || []).length}</SidebarCounter>
      </li>
    );

    const { count } = this.state;

    for (const product of products) {
      const { uom } = product;
      const productName = product.product ? product.product.name : 'not name';
      const uomCode = uom ? uom.code : 'not uom';
      const realData = realDatas.find(rd => rd._id === product._id);
      const quantity = realData ? realData.quantity : 0;

      result.push(
        this.renderView(productName, quantity * count + '/' + uomCode + '/')
      );
    }

    return result;
  };

  renderDetailNeed() {
    const { overallWorkDetail } = this.props;
    const { needProducts } = this.state;
    const needProductsDetail = overallWorkDetail?.needProductsData;

    return (
      <SidebarList className="no-link">
        {this.renderProducts(
          'NeedProducts',
          needProductsDetail || [],
          needProducts || []
        )}
      </SidebarList>
    );
  }

  renderDetailResult() {
    const { overallWorkDetail } = this.props;
    const { resultProducts } = this.state;
    const resultProductsDetail = overallWorkDetail?.resultProductsData;

    return (
      <SidebarList className="no-link">
        {this.renderProducts(
          'ResultProducts',
          resultProductsDetail || [],
          resultProducts || []
        )}
      </SidebarList>
    );
  }

  onChange = e => {
    const count = Number(e.target.value);

    this.setState({
      count
    });
  };

  renderLabel = (max?: number) => {
    return max && max > 0 ? `Count /max: ${max}/` : `Count`;
  };

  onSelectDate = (value, name) => {
    this.setState({ [name]: value } as any);
  };

  onChangeSelect = (name, value) => {
    this.setState({ [name]: value } as any);
  };

  renderLoc(obj) {
    if (!obj) {
      return 'unknown';
    }

    return `${obj.code} - ${obj.title}`;
  }

  renderContent = (formProps: IFormProps) => {
    const {
      closeModal,
      renderButton,
      max,
      overallWorkDetail,
      perform
    } = this.props;

    const { isSubmitted } = formProps;
    const { type, count, needProducts, resultProducts, date } = this.state;

    return (
      <>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>{__(`Date`)}</ControlLabel>
              <DateContainer>
                <DateControl
                  name="date"
                  dateFormat="YYYY/MM/DD"
                  timeFormat={true}
                  placeholder="Choose date"
                  value={date}
                  onChange={value => this.onSelectDate(value, 'date')}
                />
              </DateContainer>
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>
                {this.renderLabel(max)}
              </ControlLabel>
              <FormControl
                name="count"
                defaultValue={this.state.count}
                type="number"
                max={max}
                autoFocus={true}
                required={true}
                onChange={this.onChange}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <FormControl
                name="type"
                componentClass="select"
                value={type}
                required={false}
                onChange={this.onChangeSelect.bind(this, 'type')}
              >
                <option value="">All type</option>
                {Object.keys(JOB_TYPE_CHOISES).map(jt => (
                  <option value={jt} key={Math.random()}>
                    {JOB_TYPE_CHOISES[jt]}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>
                {__(`In Branch`)}: {this.renderLoc(overallWorkDetail.inBranch)}
              </ControlLabel>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {__(`In Department`)}:{' '}
                {this.renderLoc(overallWorkDetail.inDepartment)}
              </ControlLabel>
            </FormGroup>
          </FormColumn>

          <FormColumn>
            <FormGroup>
              <ControlLabel>
                {__(`Out Branch`)}:{' '}
                {this.renderLoc(overallWorkDetail.outBranch)}
              </ControlLabel>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {__(`Out Department`)}:{' '}
                {this.renderLoc(overallWorkDetail.outDepartment)}
              </ControlLabel>
            </FormGroup>
          </FormColumn>
        </FormWrapper>

        <Box title={'Details:'}>
          <FormWrapper>
            <FormColumn>{this.renderDetailNeed()}</FormColumn>
            <FormColumn>{this.renderDetailResult()}</FormColumn>
          </FormWrapper>
        </Box>

        <ModalFooter>
          <Button
            btnStyle="simple"
            onClick={closeModal}
            icon="times-circle"
            uppercase={false}
          >
            Close
          </Button>

          {renderButton({
            name: 'Performance',
            values: {
              count,
              performNeedProducts: needProducts,
              performResultProducts: resultProducts
            },
            isSubmitted,
            callback: closeModal,
            object: null
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
