import Button from '@erxes/ui/src/components/Button';
import { IDynamic } from '../types';
import { __ } from '@erxes/ui/src/utils';
import React, { useState } from 'react';
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
import { menuDynamic } from '../constants';

type Props = {
  msdynamics: IDynamic;
  configsSave: (doc: IDynamic) => void;
};

function GeneralSettings({ msdynamics, configsSave }: Props) {
  const [endPoint, setEndpoint] = useState(msdynamics.endPoint || '');
  const [username, setUsername] = useState(msdynamics.username || '');
  const [password, setPassword] = useState(msdynamics.password || '');

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Msdynamics'), link: '/msdynamics' }
  ];

  const onSave = () => {
    const doc = {
      _id: msdynamics && msdynamics._id,
      endPoint,
      username,
      password
    };

    configsSave(doc);
  };

  const content = (
    <ContentBox id={'GeneralSettingsMenu'}>
      <CollapseContent title="General settings" open={true}>
        <FormGroup>
          <ControlLabel>Endpoint</ControlLabel>
          <FormControl
            defaultValue={endPoint}
            onChange={(e: any) => setEndpoint(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>UserName</ControlLabel>
          <FormControl
            defaultValue={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>password</ControlLabel>
          <FormControl
            defaultValue={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="primary"
            icon="check-circle"
            onClick={onSave}
            uppercase={false}
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
          submenu={menuDynamic}
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
