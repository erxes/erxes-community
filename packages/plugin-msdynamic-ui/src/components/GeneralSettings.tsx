import Button from '@erxes/ui/src/components/Button';
import { IMsdynamic, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import { MainStyleTitle as Title } from '@erxes/ui/src/styles/eindex';
import { Wrapper } from '@erxes/ui/src/layout';
import SideBar from './SideBar';
import {
  CollapseContent,
  ControlLabel,
  FormControl,
  FormGroup
} from '@erxes/ui/src/components';
import { ContentBox } from '../styles';
import { MainStyleModalFooter as ModalFooter } from '@erxes/ui/src/styles/eindex';

type Props = {
  msdynamics: IMsdynamic[];
  types: IType[];
  typeId?: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (msdynamic: IMsdynamic) => void;
  edit: (msdynamic: IMsdynamic) => void;
  loading: boolean;
};

function GeneralSettings({ loading }: Props) {
  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Msdynamics'), link: '/msdynamics' }
  ];

  const renderItem = (key: string) => {
    return (
      <FormGroup>
        <ControlLabel>{key}</ControlLabel>
        <FormControl
          defaultValue={''}
          // onChange={this.onChangeInput.bind(this, key)}
        />
      </FormGroup>
    );
  };

  const content = (
    <ContentBox id={'GeneralSettingsMenu'}>
      <CollapseContent title="General settings" open={true}>
        {renderItem('endpoint')}
        {renderItem('username')}
        {renderItem('password')}
        <ModalFooter>
          <Button
            btnStyle="primary"
            icon="check-circle"
            // onClick={this.onSave}
            uppercase={false}
            // disabled={config.stageId ? false : true}
          >
            Save
          </Button>
        </ModalFooter>
      </CollapseContent>
    </ContentBox>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Msdynamics config')}
          breadcrumb={breadcrumb}
        />
      }
      actionBar={
        <Wrapper.ActionBar
          left={<Title>{__('Msdynamic')}</Title>}
          background="colorWhite"
        />
      }
      leftSidebar={<SideBar />}
      content={content}
      transparent={true}
      hasBorder={true}
    />
  );
}

export default GeneralSettings;
