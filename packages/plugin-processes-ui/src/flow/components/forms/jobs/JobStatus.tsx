import Label from '@erxes/ui/src/components/Label';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { FLOWJOB_TYPES } from '../../../../flow/constants';
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

type State = {
  jobReferById: any;
  productById: any;
};

class JobStatus extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { jobRefers, products } = this.props;

    const jobReferById = {};
    for (const jobRefer of jobRefers) {
      jobReferById[jobRefer._id] = jobRefer;
    }

    const productById = {};
    for (const product of products) {
      productById[product._id] = product;
    }

    this.state = {
      jobReferById,
      productById
    };
  }

  renderLabelInfo = (style, text) => {
    return <Label lblStyle={style}>{text}</Label>;
  };

  renderProducts = (products, matchProducts?: any[], flowProduct?) => {
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
        <li key={Math.random()}>
          {matchResult === undefined && name}
          {matchResult === true && name}
          {matchResult === false && this.renderLabelInfo('danger', name)}
        </li>
      );
    });
  };

  renderBlock(title, job: IJob, kind = 'result') {
    const { jobReferById, productById } = this.state;
    const jobConfig = job.config;

    if (!jobConfig.jobReferId && !jobConfig.productId) {
      return (
        <ul key={Math.random()}>
          <b>{title}</b>
          <p>Wrong configured</p>
        </ul>
      );
    }

    let products = [];

    if (jobConfig.jobReferId) {
      if ([FLOWJOB_TYPES.JOB, FLOWJOB_TYPES.ENDPOINT].includes(job.type)) {
        const jobRefer = jobReferById[jobConfig.jobReferId] || {};
        products =
          kind === 'need' ? jobRefer.needProducts : jobRefer.resultProducts;
      }
    }

    if (jobConfig.productId) {
      if (kind === 'need') {
        if ([FLOWJOB_TYPES.OUTLET, FLOWJOB_TYPES.MOVE].includes(job.type)) {
          products =
            (productById[jobConfig.productId] && [
              { product: productById[jobConfig.productId] }
            ]) ||
            [];
        }
        if (job.type === FLOWJOB_TYPES.INCOME) {
          products = [];
        }
      } else {
        if ([FLOWJOB_TYPES.INCOME, FLOWJOB_TYPES.MOVE].includes(job.type)) {
          products =
            (productById[jobConfig.productId] && [
              { product: productById[jobConfig.productId] }
            ]) ||
            [];
          console.log(products);
        }
        if (job.type === FLOWJOB_TYPES.OUTLET) {
          products = [];
        }
      }
    }

    return (
      <ul key={Math.random()}>
        <b>{title}</b>
        {this.renderProducts(products)}
      </ul>
    );
  }

  render() {
    const { activeFlowJob, flowJobs } = this.props;

    if (!activeFlowJob) {
      return <>Not found active job</>;
    }

    const activeFlowJobId =
      activeFlowJob && activeFlowJob.id ? activeFlowJob.id : '';
    const beforeFlowJobs = flowJobs.filter(e =>
      (e.nextJobIds || []).includes(activeFlowJobId)
    );

    return (
      <FormWrapper>
        <FormColumn>
          <Label lblColor="#673FBD">Өмнөх дамжлагаас бэлэн болох:</Label>
          {(beforeFlowJobs || []).map(b => this.renderBlock(`${b.label}`, b))}
        </FormColumn>

        <FormColumn>
          <Label lblColor="#3CCC38">Уг дамжлагад хэрэгцээт:</Label>
          {this.renderBlock('', activeFlowJob, 'need')}

          <Label lblColor="#F7CE53">Уг дамжлагаас гарц:</Label>
          {this.renderBlock('', activeFlowJob)}
        </FormColumn>
      </FormWrapper>
    );
  }
}

export default JobStatus;
