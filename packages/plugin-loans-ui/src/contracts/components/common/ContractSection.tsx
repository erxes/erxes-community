import {
  Box,
  EmptyState,
  Icon,
  ModalTrigger,
  MainStyleButtonRelated as ButtonRelated,
  __,
  SectionBodyItem,
  Alert
} from '@erxes/ui/src';
import React from 'react';
import { Link } from 'react-router-dom';
import ContractChooser from '../../containers/ContractChooser';
import { mutations, queries } from '../../graphql';
import {
  EditMutationResponse,
  IContract,
  IContractDoc,
  MainQueryResponse
} from '../../types';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

type Props = {
  name: string;
  contractsQuery?: MainQueryResponse;
  mainType?: string;
  mainTypeId?: string;
  onSelect?: (contract: IContract[]) => void;
  collapseCallback?: () => void;
  contractsEdit: any;
  title?: string;
};

function Component(
  this: any,
  {
    name,
    contractsQuery = { contractsMain: { list: [] } } as any,
    mainType = '',
    mainTypeId = '',
    collapseCallback,
    title,
    contractsEdit,
    ...other
  }: Props
) {
  console.log('other', other);
  const renderContractChooser = props => {
    return (
      <ContractChooser
        {...props}
        data={{
          name,
          contracts: contractsQuery?.contractsMain?.list,
          mainType,
          mainTypeId
        }}
        onSelect={(contracts: IContractDoc[]) => {
          contractsEdit({
            variables: { ...contracts[0], dealId: mainTypeId }
          })
            .then(() => {
              collapseCallback && collapseCallback();
            })
            .catch(e => {
              Alert.error(e.message);
            });
        }}
      />
    );
  };

  const renderRelatedContractChooser = props => {
    return (
      <ContractChooser
        {...props}
        data={{
          name,
          contracts: contractsQuery?.contractsMain?.list,
          mainTypeId,
          mainType,
          isRelated: true
        }}
        onSelect={(contracts: IContractDoc[]) => {
          contractsEdit({
            variables: { ...contracts[0], dealId: mainTypeId }
          })
            .then(() => {
              collapseCallback && collapseCallback();
            })
            .catch(e => {
              Alert.error(e.message);
            });
        }}
      />
    );
  };

  const contractTrigger = (
    <button>
      <Icon icon="plus-circle" />
    </button>
  );

  const relContractTrigger = (
    <ButtonRelated>
      <span>{__('See related contracts..')}</span>
    </ButtonRelated>
  );

  const quickButtons = (
    <ModalTrigger
      title="Associate"
      trigger={contractTrigger}
      size="lg"
      content={renderContractChooser}
    />
  );

  const relQuickButtons = (
    <ModalTrigger
      title="Related Associate"
      trigger={relContractTrigger}
      size="lg"
      content={renderRelatedContractChooser}
    />
  );

  const content = (
    <>
      {contractsQuery?.contractsMain?.list.map((contract, index) => (
        <SectionBodyItem key={index}>
          <Link to={`/erxes-plugin-loan/contract-details/${contract._id}`}>
            <Icon icon="arrow-to-right" />
          </Link>
          <span>{contract.number || 'Unknown'}</span>
        </SectionBodyItem>
      ))}
      {contractsQuery?.contractsMain?.list.length === 0 && (
        <EmptyState icon="building" text="No contract" />
      )}
      {mainTypeId && mainType && relQuickButtons}
    </>
  );

  return (
    <Box
      title={__(`${title || 'Contracts'}`)}
      name="showContracts"
      extraButtons={quickButtons}
      isOpen={true}
      callback={collapseCallback}
    >
      {content}
    </Box>
  );
}

type IProps = {
  mainType?: string;
  mainTypeId?: string;
  isOpen?: boolean;
  contracts?: IContract[];
  onSelect?: (datas: IContract[]) => void;
  collapseCallback?: () => void;
};

export default withProps<IProps>(
  compose(
    graphql<{ mainTypeId: any }, MainQueryResponse, any>(
      gql(queries.contractsMain),
      {
        name: 'contractsQuery',
        options: ({ mainTypeId }) => {
          return {
            fetchPolicy: 'network-only',
            variables: { dealId: mainTypeId }
          };
        }
      }
    ),
    // mutations
    graphql<{}, EditMutationResponse, any>(gql(mutations.contractsEdit), {
      name: 'contractsEdit',
      options: { refetchQueries: ['contractsMain'] }
    })
  )(Component)
);
