import Common from '../Common';
import { ProductButton } from '@erxes/ui-cards/src/deals/styles';
import FormControl from '@erxes/ui/src/components/form/Control';
import JobReferChooser from '../../../../../job/containers/refer/Chooser';
import FormGroup from '@erxes/ui/src/components/form/Group';
import React from 'react';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import { __ } from '@erxes/ui/src/utils';
import { ControlLabel } from '@erxes/ui/src/components/form';
import { DrawerDetail } from '../../../../styles';
import { FormColumn, FormWrapper } from '@erxes/ui/src/styles/main';
import { IJob } from '../../../../types';
import { IJobRefer } from '../../../../../job/types';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Icon from '@erxes/ui/src/components/Icon';

type Props = {
  closeModal: () => void;
  activeFlowJob: IJob;
  jobRefer: IJobRefer;
  flowJobs: IJob[];
  addFlowJob: (job: IJob, id?: string, config?: any) => void;
  setUsedPopup: (check: boolean) => void;
};

type State = {
  jobReferId: string;
  jobRefer?: IJobRefer;
  description: string;
  inBranchId: string;
  inDepartmentId: string;
  outBranchId: string;
  outDepartmentId: string;
  currentTab: string;
  categoryId: string;
};

class JobForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { jobRefer, activeFlowJob } = props;
    const { config, description } = activeFlowJob;

    const {
      jobReferId,
      inBranchId,
      inDepartmentId,
      outBranchId,
      outDepartmentId
    } = config;

    this.state = {
      jobReferId: jobReferId || '',
      jobRefer,
      description: description || '',
      inBranchId: inBranchId || '',
      inDepartmentId: inDepartmentId || '',
      outBranchId: outBranchId || '',
      outDepartmentId: outDepartmentId || '',
      currentTab: 'inputs',

      categoryId: ''
    };
  }

  onSelect = (name, value) => {
    this.setState({ [name]: value } as any);
  };

  renderJobTrigger(job?: IJobRefer) {
    const onClick = () => {
      this.props.setUsedPopup(true);
    };

    let content = (
      <div onClick={onClick}>
        {__('Choose Job')} <Icon icon="plus-circle" />
      </div>
    );

    if (job) {
      content = (
        <div onClick={onClick}>
          {job.name} <Icon icon="pen-1" />
        </div>
      );
    }

    return <ProductButton>{content}</ProductButton>;
  }

  renderContent() {
    const {
      jobRefer,
      description,
      inBranchId,
      inDepartmentId,
      outBranchId,
      outDepartmentId
    } = this.state;

    const onChangeValue = (type, e) => {
      this.setState({ [type]: e.target.value } as any);
    };

    const onChangeJob = prs => {
      let pr: any;
      if (!prs.length) {
        this.setState({ jobReferId: '', jobRefer: undefined });
        return;
      }

      pr = prs[0];
      this.setState({ jobReferId: pr._id, jobRefer: pr });
    };

    const content = props => {
      const onCloseModal = () => {
        this.props.setUsedPopup(false);
        props.closeModal();
      };

      return (
        <JobReferChooser
          {...props}
          closeModal={onCloseModal}
          onSelect={onChangeJob}
          onChangeCategory={categoryId => this.setState({ categoryId })}
          categoryId={this.state.categoryId}
          types={['facture', 'income', 'outlet', 'move']}
          data={{
            name: 'Jobs',
            jobRefers: jobRefer ? [jobRefer] : []
          }}
          limit={1}
        />
      );
    };

    return (
      <DrawerDetail>
        <FormGroup>
          <ControlLabel>Jobs</ControlLabel>
          <ModalTrigger
            title="Choose a JOB"
            trigger={this.renderJobTrigger(jobRefer)}
            size="lg"
            content={content}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            name="description"
            value={description}
            onChange={onChangeValue.bind(this, 'description')}
          />
        </FormGroup>
        <>
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel>inBranch</ControlLabel>
                <SelectBranches
                  label="Choose branch"
                  name="selectedBranchIds"
                  initialValue={inBranchId}
                  onSelect={branchId => this.onSelect('inBranchId', branchId)}
                  multi={false}
                  customOption={{ value: 'all', label: 'All branches' }}
                />
              </FormGroup>
            </FormColumn>
            <FormColumn>
              <FormGroup>
                <ControlLabel>inDepartment</ControlLabel>
                <SelectDepartments
                  label="Choose department"
                  name="selectedDepartmentIds"
                  initialValue={inDepartmentId}
                  onSelect={departmentId =>
                    this.onSelect('inDepartmentId', departmentId)
                  }
                  multi={false}
                  customOption={{ value: 'all', label: 'All departments' }}
                />
              </FormGroup>
            </FormColumn>
          </FormWrapper>

          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel>outBranch</ControlLabel>
                <SelectBranches
                  label="Choose branch"
                  name="selectedBranchIds"
                  initialValue={outBranchId}
                  onSelect={branchId => this.onSelect('outBranchId', branchId)}
                  multi={false}
                  customOption={{ value: 'all', label: 'All branches' }}
                />
              </FormGroup>
            </FormColumn>
            <FormColumn>
              <FormGroup>
                <ControlLabel>outDepartment</ControlLabel>
                <SelectDepartments
                  label="Choose department"
                  name="selectedDepartmentIds"
                  initialValue={outDepartmentId}
                  onSelect={departmentId =>
                    this.onSelect('outDepartmentId', departmentId)
                  }
                  multi={false}
                  customOption={{ value: 'all', label: 'All departments' }}
                />
              </FormGroup>
            </FormColumn>
          </FormWrapper>
        </>
      </DrawerDetail>
    );
  }

  render() {
    const {
      jobReferId,
      jobRefer,
      description,
      inBranchId,
      inDepartmentId,
      outBranchId,
      outDepartmentId
    } = this.state;

    return (
      <Common
        {...this.props}
        name={(jobRefer && jobRefer.name) || 'Unknown'}
        description={description}
        config={{
          jobReferId,
          inBranchId,
          inDepartmentId,
          outBranchId,
          outDepartmentId
        }}
      >
        {this.renderContent()}
      </Common>
    );
  }
}

export default JobForm;
