import FormGroup from '@erxes/ui/src/components/form/Group';
import Info from '@erxes/ui/src/components/Info';
import Label from '@erxes/ui/src/components/Label';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { ControlLabel } from '@erxes/ui/src/components/form';

import { FormColumn, FormWrapper } from '@erxes/ui/src/styles/main';
import { IJob } from '../../../types';
import { IJobRefer } from '../../../../job/types';
import { IProduct } from '../../../../types';

type Props = {
  closeModal: () => void;
  activeFlowJob: IJob;
  flowJobs: IJob[];
  setUsedPopup: (check: boolean) => void;
  jobRefers: IJobRefer[];
  products: IProduct[];
};

class JobStatus extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  renderLabelInfo = (style, text) => {
    return <Label lblStyle={style}>{text}</Label>;
  };

  renderProducts = (products, type, matchProducts?: any[], flowProduct?) => {
    const space = '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';

    return products.map(product => {
      const name = product.product ? product.product.name : '';

      let matchResult: any[] | boolean | undefined =
        matchProducts && matchProducts.length > 0
          ? matchProducts.includes(name)
          : matchProducts;

      if (flowProduct) {
        matchResult = flowProduct && flowProduct.name === name ? true : false;
      }

      return (
        <>
          <FormGroup>
            <ControlLabel key={product.id}>
              {space} - {matchResult === undefined && name}
              {matchResult === true && name}
              {matchResult === false && this.renderLabelInfo('danger', name)}
            </ControlLabel>
          </FormGroup>
        </>
      );
    });
  };

  renderFlowJobs = (
    chosenFlowJobs: IJob[],
    jobRefers,
    type,
    beforeFlowJobs: IJob[]
  ) => {
    let beforeResultProducts: any = [];
    if ((beforeFlowJobs || []).length > 0) {
      for (const before of beforeFlowJobs) {
        const jobRefer =
          (jobRefers || []).find(job => job._id === before.config.jobReferId) ||
          {};
        const resultProducts = jobRefer.resultProducts || [];

        const productNames = resultProducts.map(e =>
          e.product ? e.product.name : ''
        );

        beforeResultProducts = beforeResultProducts.concat(productNames);
      }
    }

    return chosenFlowJobs.map(flowJob => {
      if (!flowJob.config.jobReferId) {
        return [];
      }

      const jobRefer =
        (jobRefers || []).find(job => job._id === flowJob.config.jobReferId) ||
        {};
      const needProducts = jobRefer.needProducts || [];
      const resultProducts = jobRefer.resultProducts || [];

      beforeResultProducts =
        beforeResultProducts.length === 0 ? false : beforeResultProducts;

      return (
        <Info type="primary" title="">
          <FormGroup>
            <ControlLabel key={flowJob.id}>{flowJob.label}</ControlLabel>
          </FormGroup>
          {type === 'next' && this.renderProducts(needProducts, 'need')}
          {type === 'prev' && this.renderProducts(resultProducts, 'result')}
          {type === 'cur' &&
            this.renderProducts(needProducts, 'need', beforeResultProducts)}
        </Info>
      );
    });
  };

  renderList(title, products, type) {
    return (
      <Info type="success" title={title}>
        {this.renderProducts(products, type)}
      </Info>
    );
  }

  render() {
    const { jobRefers } = this.props;

    const { activeFlowJob, flowJobs } = this.props;

    const activeFlowJobId =
      activeFlowJob && activeFlowJob.id ? activeFlowJob.id : '';
    const beforeFlowJobs = flowJobs.filter(e =>
      (e.nextJobIds || []).includes(activeFlowJobId)
    );

    const jobRefer = (jobRefers || []).length && jobRefers[0];

    const needProducts = (jobRefer || {}).needProducts || [];
    const resultProducts = (jobRefer || {}).resultProducts || [];

    return (
      <FormWrapper>
        <FormColumn>
          <Info type="primary" title="Өмнөх жоб бүтээгдэхүүнүүд">
            {this.renderFlowJobs(beforeFlowJobs, jobRefer, 'prev', [])}
          </Info>
        </FormColumn>

        <FormColumn>
          <Info type="success" title="Шаардлагатай бүтээгдэхүүнүүд">
            {activeFlowJob &&
              this.renderFlowJobs(
                [activeFlowJob],
                jobRefer,
                'cur',
                beforeFlowJobs
              )}
          </Info>
        </FormColumn>

        {this.renderList('In products', needProducts, 'need')}
        {this.renderList('Out products', resultProducts, 'result')}
      </FormWrapper>
    );
  }
}

export default JobStatus;
