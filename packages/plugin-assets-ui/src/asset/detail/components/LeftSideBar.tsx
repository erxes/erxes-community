import { ControlLabel, Icon, ModalTrigger } from '@erxes/ui/src';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import gql from 'graphql-tag';
import React from 'react';
import { IAsset } from '../../../common/types';
import { ContainerBox, KnowledgeBaseCard } from '../../../style';
import { queries } from '../../graphql';
import BasicInfo from '../containers/BasicInfo';
import CustomFieldsSection from '../containers/CustomFieldSection';
import KnowledgeBase from './KnowledgeBaseForm';

type Props = {
  asset: IAsset;
  history: any;
};

class LeftSidebar extends React.Component<Props> {
  render() {
    const { asset, history } = this.props;

    const { knowledgeBaseData } = asset;

    const refetchQueries = [
      {
        query: gql(queries.assetDetail),
        variables: { _id: asset._id }
      }
    ];

    const editKnowledgeForm = data => {
      const trigger = (
        <KnowledgeBaseCard>
          <Icon icon="head-1" size={30} />
          <ControlLabel>{data.name}</ControlLabel>
        </KnowledgeBaseCard>
      );

      data.contents = data.contents.map(content => ({ ...content, isTitleEntered: true }));

      const content = props => {
        const updatedProps = {
          ...props,
          assetId: asset._id,
          knowledgeBaseData: data
        };

        return <KnowledgeBase {...updatedProps} />;
      };

      return (
        <ModalTrigger
          key={data._id}
          content={content}
          trigger={trigger}
          title="Edit Knowledge Base"
          size="lg"
        />
      );
    };

    return (
      <Sidebar wide={true}>
        <BasicInfo asset={asset} refetchQueries={refetchQueries} history={history} />
        <Sidebar.Section>
          <ContainerBox gap={5} flexWrap={true}>
            {(knowledgeBaseData || []).map(data => editKnowledgeForm(data))}
          </ContainerBox>
        </Sidebar.Section>

        <CustomFieldsSection asset={asset} />
      </Sidebar>
    );
  }
}

export default LeftSidebar;
