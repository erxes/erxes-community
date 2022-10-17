import React from 'react';
import {
  FormControl,
  FormGroup,
  ControlLabel,
  Form as CommonForm,
  Uploader,
  ModalTrigger,
  Button,
  extractAttachment,
  Tabs,
  TabTitle
} from '@erxes/ui/src';
import { FormWrapper, FormColumn, ModalFooter } from '@erxes/ui/src/styles/main';
import { generateGroupOptions, generateParentOptions } from '../../common/utils';
import { IAsset, IAssetGroupTypes } from '../../common/types';
import { ASSET_SUPPLY, TYPES } from '../../common/constant';
import { Row } from '@erxes/ui-inbox/src/settings/integrations/styles';
import EditorCK from '@erxes/ui/src/components/EditorCK';
import GroupForm from '../group/containers/Form';
import { IAttachment, IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import { TabContainer, TabContent, TriggerTabs } from '../../style';

type Props = {
  asset?: IAsset;
  assets: IAsset[];
  groups: IAssetGroupTypes[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};
type State = {
  disabled: boolean;
  assetCount: number;
  minimiumCount: number;
  attachment?: IAttachment;
  attachmentMore?: IAttachment[];
  vendorId: string;
  parentId: string;
  groupId: string;
  description: string;
  currentTab: string;
};
class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const asset = props.asset || ({} as IAsset);
    const {
      attachment,
      attachmentMore,
      supply,
      assetCount,
      minimiumCount,
      vendorId,
      parentId,
      groupId,
      description
    } = asset;

    this.state = {
      disabled: supply === 'limited' ? false : true,
      assetCount: assetCount ? assetCount : 0,
      minimiumCount: minimiumCount ? minimiumCount : 0,
      attachment: attachment ? attachment : undefined,
      attachmentMore: attachmentMore ? attachmentMore : undefined,
      vendorId: vendorId ? vendorId : '',
      groupId: groupId ? groupId : '',
      parentId: parentId ? parentId : '',
      description: description ? description : '',
      currentTab: parentId ? 'Parent' : 'Group'
    };

    this.renderContent = this.renderContent.bind(this);
  }

  generateDoc = (values: {
    _id?: string;
    attachment?: IAttachment;
    attachmentMore?: IAttachment[];
    assetCount: number;
    minimiumCount: number;
    vendorId: string;
    description: string;
  }) => {
    const { asset } = this.props;
    const finalValues = values;
    const {
      attachment,
      attachmentMore,
      assetCount,
      minimiumCount,
      vendorId,
      description
    } = this.state;

    if (asset) {
      finalValues._id = asset._id;
    }

    finalValues.attachment = attachment;

    return {
      ...finalValues,
      attachment,
      attachmentMore,
      assetCount,
      minimiumCount,
      vendorId,
      description
    };
  };

  renderFormTrigger(trigger: React.ReactNode) {
    const content = props => <GroupForm {...props} groups={this.props.groups} />;

    return <ModalTrigger title="Add Asset Group" trigger={trigger} content={content} />;
  }
  onChangeDescription = e => {
    this.setState({ description: e.editor.getData() });
  };

  onSupplyChange = e => {
    const { assetCount, minimiumCount } = this.state;
    const islimited = e.target.value === 'limited';
    const isUnique = e.target.value === 'unique';

    this.setState({
      disabled: islimited ? false : true,
      assetCount: islimited ? assetCount : isUnique ? 1 : 0,
      minimiumCount: islimited ? minimiumCount : 0
    });
  };
  onComboEvent = (variable: string, e) => {
    let value = '';

    switch (variable) {
      case 'vendorId':
        value = e;
        break;
      default:
        value = e.target.value;
    }

    this.setState({ [variable]: value } as any);
  };
  onChangeAttachment = (files: IAttachment[]) => {
    this.setState({ attachment: files.length ? files[0] : undefined });
  };

  onChangeAttachmentMore = (files: IAttachment[]) => {
    this.setState({ attachmentMore: files ? files : undefined });
  };

  onChangeCurrentTab = selecteTab => {
    switch (selecteTab) {
      case 'Parent':
        this.setState({ groupId: '', currentTab: selecteTab });
        break;
      case 'Group':
        this.setState({ parentId: '', currentTab: selecteTab });
        break;
    }
  };

  renderContent(formProps: IFormProps) {
    const { asset, groups, assets, closeModal, renderButton } = this.props;

    const { description, disabled, assetCount, minimiumCount, vendorId } = this.state;

    const { values, isSubmitted } = formProps;

    const object = asset || ({} as IAsset);

    const attachments = (object.attachment && extractAttachment([object.attachment])) || [];

    const attachmentsMore =
      (object.attachmentMore && extractAttachment(object.attachmentMore)) || [];

    const addGroupTrigger = (
      <Button btnStyle="primary" uppercase={false} icon="plus-circle">
        Add group
      </Button>
    );

    const currentTabItem = () => {
      const { currentTab } = this.state;

      if (currentTab === 'Parent') {
        return (
          <FormGroup>
            <ControlLabel required={true}>Parent</ControlLabel>
            <FormControl
              {...formProps}
              name="parentId"
              componentClass="select"
              defaultValue={object.parentId}
            >
              <option />
              {generateParentOptions(assets)}
            </FormControl>
          </FormGroup>
        );
      }

      return (
        <FormGroup>
          <ControlLabel required={true}>Group</ControlLabel>
          <Row>
            <FormControl
              {...formProps}
              name="groupId"
              componentClass="select"
              defaultValue={object.groupId}
            >
              <option />
              {generateGroupOptions(groups)}
            </FormControl>

            {this.renderFormTrigger(addGroupTrigger)}
          </Row>
        </FormGroup>
      );
    };

    return (
      <>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>Name</ControlLabel>
              <FormControl
                {...formProps}
                name="name"
                defaultValue={object.name}
                autoFocus={true}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Vendor</ControlLabel>
              <SelectCompanies
                label="Choose an vendor"
                name="vendorId"
                customOption={{ value: '', label: 'No vendor chosen' }}
                initialValue={vendorId}
                onSelect={this.onComboEvent.bind(this, 'vendorId')}
                multi={false}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel required={true}>Unit price</ControlLabel>
              <p>
                Please ensure you have set the default currency in the{' '}
                <a href="/settings/general"> {'General Settings'}</a> of the System Configuration.
              </p>
              <FormControl
                {...formProps}
                type="number"
                name="unitPrice"
                defaultValue={object.unitPrice}
                required={true}
                min={0}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>Code</ControlLabel>
              <p>
                Depending on your business type, you may type in a barcode or any other UPC
                (Universal Asset Code). If you don't use UPC, type in any numeric value to
                differentiate your assets.
              </p>
              <FormControl {...formProps} name="code" defaultValue={object.code} required={true} />
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <TabContainer>
          <TriggerTabs>
            <Tabs full>
              {['Group', 'Parent'].map(item => (
                <TabTitle
                  className={this.state.currentTab === item ? 'active' : ''}
                  key={item}
                  onClick={this.onChangeCurrentTab.bind(this, item)}
                >
                  {item}
                </TabTitle>
              ))}
            </Tabs>
          </TriggerTabs>
          <TabContent>{currentTabItem()}</TabContent>
        </TabContainer>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <EditorCK
                content={description}
                onChange={this.onChangeDescription}
                height={150}
                isSubmitted={formProps.isSaved}
                name={`asset_description_${description}`}
                toolbar={[
                  {
                    name: 'basicstyles',
                    items: [
                      'Bold',
                      'Italic',
                      'NumberedList',
                      'BulletedList',
                      'Link',
                      'Unlink',
                      '-',
                      'Image',
                      'EmojiPanel'
                    ]
                  }
                ]}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Featured image</ControlLabel>

              <Uploader
                defaultFileList={attachments}
                onChange={this.onChangeAttachment}
                multiple={false}
                single={true}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Secondary Images</ControlLabel>

              <Uploader
                defaultFileList={attachmentsMore}
                onChange={this.onChangeAttachmentMore}
                multiple={true}
                single={false}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle" uppercase={false}>
            Close
          </Button>

          {renderButton({
            text: 'asset and movements',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: asset
          })}
        </ModalFooter>
      </>
    );
  }

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
