import Common from '../Common';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { ControlLabel } from '@erxes/ui/src/components/form';
import { DrawerDetail } from '../../../../styles';
import { IJob } from '../../../../types';
import { IJobRefer } from '../../../../../job/types';
import { IProduct } from '@erxes/ui-products/src/types';

type Props = {
  closeModal: () => void;
  activeFlowJob: IJob;
  jobRefers: IJobRefer[];
  flowJobs: IJob[];
  lastFlowJob?: IJob;
  flowProduct?: IProduct;
  addFlowJob: (job: IJob, id?: string, config?: any) => void;
};

type State = {
  jobReferId: string;
  description: string;
  inBranchId: string;
  inDepartmentId: string;
  outBranchId: string;
  outDepartmentId: string;
  currentTab: string;
};

class JobForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { config, description } = props.activeFlowJob;

    const {
      jobReferId,
      inBranchId,
      inDepartmentId,
      outBranchId,
      outDepartmentId
    } = config;

    this.state = {
      jobReferId: jobReferId || '',
      description: description || '',
      inBranchId: inBranchId || '',
      inDepartmentId: inDepartmentId || '',
      outBranchId: outBranchId || '',
      outDepartmentId: outDepartmentId || '',
      currentTab: 'inputs'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFlowJob !== this.props.activeFlowJob) {
      this.setState({ jobReferId: nextProps.activeFlowJob.jobReferId });
    }
  }

  renderContent() {
    const { jobRefers } = this.props;

    const onChangeValue = (type, e) => {
      this.setState({ [type]: e.target.value } as any);
    };

    const { jobReferId, description } = this.state;

    return (
      <DrawerDetail>
        <FormGroup>
          <ControlLabel>Jobs</ControlLabel>
          <FormControl
            name="type"
            componentClass="select"
            onChange={onChangeValue.bind(this, 'jobReferId')}
            required={true}
            value={jobReferId}
          >
            <option value="" />
            {jobRefers.map(jobRefer => (
              <option key={jobRefer._id} value={jobRefer._id}>
                {jobRefer.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            name="description"
            value={description}
            onChange={onChangeValue.bind(this, 'description')}
          />
        </FormGroup>
      </DrawerDetail>
    );
  }

  render() {
    const {
      jobReferId,
      description,
      inBranchId,
      inDepartmentId,
      outBranchId,
      outDepartmentId
    } = this.state;

    return (
      <Common
        description={description}
        config={{
          jobReferId,
          inBranchId,
          inDepartmentId,
          outBranchId,
          outDepartmentId
        }}
        {...this.props}
      >
        {this.renderContent()}
      </Common>
    );
  }
}

export default JobForm;
