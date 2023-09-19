import Button from '@erxes/ui/src/components/Button';
import { FormControl } from '@erxes/ui/src/components/form';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Uploader from '@erxes/ui/src/components/Uploader';
import { __ } from '@erxes/ui/src/utils';
import React, { useState } from 'react';
import {
  GeneralWrapper,
  Colors,
  Logos,
  AppearanceWrapper,
  WelcomeContent,
  TeamPortal,
  FeatureRow,
  FeatureRowItem
} from '../styles';
import TwitterPicker from 'react-color/lib/Twitter';
import { ColorPick, ColorPicker } from '../styles';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { IExm, IWelcomeContent } from '../types';

const getEmptyPage = () => ({
  _id: Math.random().toString(),
  image: undefined,
  title: '',
  content: ''
});

type Props = {
  exm: IExm;
  edit: (variables: IExm) => void;
};

export default function Appearance(props: Props) {
  const { exm, edit } = props;

  const exmLogo = exm.logo;
  const exmFavicon = exm.favicon;
  const exmAppearance = exm.appearance;
  const exmPages = exm.welcomeContent || ([] as IWelcomeContent[]);
  const [logo, setLogo] = useState(exmLogo);
  const [favicon, setFavicon] = useState(exmFavicon);
  const [url, setUrl] = useState(exm.url || '');
  const [webName, setWebName] = useState(exm.webName || '');
  const [webDescription, setWebDescription] = useState(
    exm.webDescription || ''
  );
  const [appearance, setAppearance] = useState(
    exmAppearance
      ? {
          primaryColor: exmAppearance.primaryColor,
          secondaryColor: exmAppearance.secondaryColor
        }
      : { primaryColor: 'red', secondaryColor: 'green' }
  );

  const [welcomeContent, setWelcomeContent] = useState(
    exmPages.length > 0
      ? exmPages.map(e => ({
          _id: e._id,
          title: e.title,
          content: e.content,
          image: e.image
            ? {
                name: e.image.name,
                url: e.image.url,
                size: e.image.size,
                type: e.image.type
              }
            : undefined
        }))
      : [getEmptyPage()]
  );

  const onSave = () => {
    edit({
      _id: props.exm._id,
      logo: logo
        ? {
            name: logo.name,
            url: logo.url,
            size: logo.size,
            type: logo.type
          }
        : undefined,
      welcomeContent,
      appearance,
      webName,
      webDescription,
      url,
      favicon: favicon
        ? {
            name: favicon.name,
            url: favicon.url,
            size: favicon.size,
            type: favicon.type
          }
        : undefined
    });
  };

  const onChangePageCount = (type: string, _id?: string) => {
    if (type === 'add') {
      setWelcomeContent([...welcomeContent, getEmptyPage()]);
    } else {
      const modifiedContents = welcomeContent.filter(f => f._id !== _id);

      setWelcomeContent(modifiedContents);
    }
  };

  const onChangeColor = (key: string, value: any) => {
    setAppearance({ ...appearance, [key]: value });
  };

  const onChangePageItem = (_id: string, key: string, value: any) => {
    const page = welcomeContent.find(f => f._id === _id);

    if (page) {
      page[key] = value;

      setWelcomeContent([...welcomeContent]);
    }
  };

  const onChangeAttachment = (e: any) => {
    setLogo(e);
  };

  const renderColorSelect = (item, color) => {
    const popoverBottom = (
      <Popover id="color-picker">
        <TwitterPicker
          width="266px"
          triangle="hide"
          color={color}
          onChange={e => onChangeColor(item, e.hex)}
        />
      </Popover>
    );

    return (
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom-start"
        overlay={popoverBottom}
      >
        <ColorPick>
          <ColorPicker
            style={{
              backgroundColor: color
            }}
          />
        </ColorPick>
      </OverlayTrigger>
    );
  };

  const renderWelcomeContent = (page, index: number) => {
    const image = welcomeContent[index].image;

    return (
      <div key={index}>
        <button
          style={{ float: 'right' }}
          onClick={() => onChangePageCount('remove', page._id)}
        >
          X
        </button>
        <ControlLabel>Page {index + 1}</ControlLabel>
        <Uploader
          defaultFileList={image ? [image] : []}
          onChange={(e: any) => {
            return onChangePageItem(page._id, 'image', e[0]);
          }}
          single={true}
        />
        <FormControl
          name="title"
          placeholder="Title"
          value={page.title}
          onChange={(e: any) => {
            return onChangePageItem(page._id, 'title', e.target.value);
          }}
        />
        <FormControl
          name="description"
          placeholder="Description"
          componentClass="textarea"
          value={page.content}
          onChange={(e: any) => {
            return onChangePageItem(page._id, 'content', e.target.value);
          }}
        />
      </div>
    );
  };

  return (
    // <AppearanceWrapper>
    <GeneralWrapper>
      <TeamPortal>
        <p>EXM Web Appearance</p>
        <FeatureRow>
          <FeatureRowItem>
            <ControlLabel>{__('Name your exm')}</ControlLabel>
            <FormControl
              value={webName}
              placeholder="Name"
              onChange={(e: any) => setWebName(e.target.value)}
            />
          </FeatureRowItem>
          <FeatureRowItem>
            <ControlLabel>{__('Describe your team portal')}</ControlLabel>
            <FormControl
              value={webDescription}
              placeholder="Description"
              onChange={(e: any) => setWebDescription(e.target.value)}
            />
          </FeatureRowItem>
          <FeatureRowItem>
            <ControlLabel>{__('Website')}</ControlLabel>
            <FormControl
              value={url}
              placeholder="website"
              onChange={(e: any) => setUrl(e.target.value)}
            />
          </FeatureRowItem>
        </FeatureRow>
      </TeamPortal>
      <Logos>
        <p>Logo and favicon</p>
        <FeatureRow>
          <FeatureRowItem>
            <p>Logos</p>
            <ControlLabel>{__('Logo 128x128 or 256x256')}</ControlLabel>
            <Uploader
              defaultFileList={logo ? [logo] : []}
              onChange={(e: any) => onChangeAttachment(e.length ? e[0] : null)}
              single={true}
            />
          </FeatureRowItem>
          <FeatureRowItem>
            <p>Favicon</p>
            <ControlLabel>{__('Logo 128x128 or 256x256')}</ControlLabel>
            <Uploader
              defaultFileList={favicon ? [favicon] : []}
              onChange={(e: any) => setFavicon(e.length ? e[0] : null)}
              single={true}
            />
          </FeatureRowItem>
        </FeatureRow>
      </Logos>

      <Colors>
        <p>Colors</p>
        <div>
          <ControlLabel>{__('Primary color')}</ControlLabel>
          {renderColorSelect('primaryColor', appearance.primaryColor)}
        </div>
        <div>
          <ControlLabel>{__('Secondary color')}</ControlLabel>
          {renderColorSelect('secondaryColor', appearance.secondaryColor)}
        </div>
      </Colors>
      <WelcomeContent>
        <p>Welcome content</p>
        <Button onClick={() => onChangePageCount('add')}>+ Add Page</Button>
        {welcomeContent.map((page, index) => renderWelcomeContent(page, index))}
      </WelcomeContent>
      <Button btnStyle="success" onClick={onSave}>
        Save
      </Button>
    </GeneralWrapper>
    // </AppearanceWrapper>
  );
}
