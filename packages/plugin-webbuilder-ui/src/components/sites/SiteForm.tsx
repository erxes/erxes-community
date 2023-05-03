import {
  CollapseLeftMenu,
  LeftMenuItems,
  LeftSidebar,
  LeftSidebarContent,
  SiteFormContainer,
  SubTitle
} from './styles';

import ContentTypeList from '../../containers/contentTypes/List';
import Detail from '../../containers/sites/Detail';
import { FlexItem } from '@erxes/ui/src/components/step/styles';
import { IPageDoc } from '../../types';
import Icon from '@erxes/ui/src/components/Icon';
import PageList from '../pages/List';
import React from 'react';
import Tip from '@erxes/ui/src/components/Tip';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  pages: IPageDoc[];
  queryParams: any;
  _id: string;
};

type State = {
  name: string;
  description: string;
  siteId: string;
  settingsObject: any;
  showDarkMode: boolean;
  showPage: boolean;
  collapseLeftSidebar: boolean;
  loading: boolean;
  showContentType: boolean;
  type?: string;
};

class SiteForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const page = props.pages[0] || ({} as IPageDoc);

    this.state = {
      name: page.name || '',
      description: page.description || '',
      siteId: page.siteId,
      settingsObject: null,
      showPage: false,
      showContentType: false,
      collapseLeftSidebar:
        localStorage.getItem('collapseWebbuilderMenu') === 'true'
          ? true
          : false || false,
      loading: false,
      showDarkMode:
        localStorage.getItem('showDarkMode') === 'true' ? true : false || false
    };
  }

  toggleSubTitle = (key: string, value: boolean) => {
    this.setState({ [key]: value } as any);
  };

  handleItemSettings = (settingsObject: any, type: string) => {
    this.setState({ settingsObject, type });
  };

  handleDarkMode = () => {
    this.setState({ showDarkMode: !this.state.showDarkMode }, () => {
      localStorage.setItem('showDarkMode', this.state.showDarkMode.toString());
    });
  };

  handeCollapse = () => {
    this.setState(
      { collapseLeftSidebar: !this.state.collapseLeftSidebar },
      () => {
        localStorage.setItem(
          'collapseWebbuilderMenu',
          this.state.showDarkMode.toString()
        );
      }
    );
  };

  onLoad = (loading?: boolean) => {
    this.setState({ loading: loading ? loading : false });
  };

  renderLeftSidebarContent() {
    const { pages = [], _id, queryParams } = this.props;
    const {
      showDarkMode,
      showContentType,
      showPage,
      collapseLeftSidebar
    } = this.state;

    const currentPageId =
      Object.keys(queryParams).length !== 0
        ? queryParams.pageId
        : (pages[0] || ({} as IPageDoc))._id;

    if (collapseLeftSidebar) {
      return null;
    }

    return (
      <>
        <SubTitle
          className="collapses"
          onClick={() => this.toggleSubTitle('showPage', !showPage)}
        >
          <i
            className={`gjs-caret-icon fa fa-caret-${
              showPage ? 'right' : 'down'
            }`}
          />
          &emsp;{__('Pages')}
        </SubTitle>
        {!showPage && (
          <LeftSidebarContent>
            <PageList
              pages={pages}
              siteId={_id}
              pageId={currentPageId}
              onLoad={this.onLoad}
              showDarkMode={showDarkMode}
              handleItemSettings={this.handleItemSettings}
            />
          </LeftSidebarContent>
        )}

        <SubTitle
          className="collapses"
          onClick={() =>
            this.toggleSubTitle('showContentType', !showContentType)
          }
        >
          <i
            className={`gjs-caret-icon fa fa-caret-${
              showContentType ? 'right' : 'down'
            }`}
          />{' '}
          &emsp;
          {__('Content Type Builder')}
        </SubTitle>
        {!showContentType && (
          <LeftSidebarContent>
            <ContentTypeList
              siteId={this.props._id}
              handleItemSettings={this.handleItemSettings}
            />
          </LeftSidebarContent>
        )}
      </>
    );
  }

  renderLeftSidebar() {
    const { showDarkMode, collapseLeftSidebar } = this.state;

    return (
      <LeftSidebar
        className={`${!showDarkMode ? 'gjs-one-bg gjs-two-color' : 'darkmode'}`}
        isCollapsed={collapseLeftSidebar}
      >
        <CollapseLeftMenu>
          {!collapseLeftSidebar && <div>{__('Navigator')}</div>}
          <LeftMenuItems>
            {!collapseLeftSidebar && (
              <Tip text={showDarkMode ? 'Show light mode' : `Show dark mode`}>
                <Icon
                  icon={showDarkMode ? 'sun-1' : `moon-1`}
                  size={15}
                  onClick={() => this.handleDarkMode()}
                />
              </Tip>
            )}
            <Icon
              icon={
                collapseLeftSidebar
                  ? 'arrow-from-right'
                  : `left-arrow-from-left`
              }
              size={15}
              onClick={() => this.handeCollapse()}
            />
          </LeftMenuItems>
        </CollapseLeftMenu>

        {this.renderLeftSidebarContent()}
      </LeftSidebar>
    );
  }

  render() {
    const { _id, queryParams, pages } = this.props;
    const { name, settingsObject, showDarkMode, type, loading } = this.state;
    const breadcrumb = [{ title: 'Sites', link: '/xbuilder' }, { title: name }];

    return (
      <>
        <Wrapper.Header title={'Site Edit Form'} breadcrumb={breadcrumb} />

        <SiteFormContainer showDarkMode={showDarkMode}>
          <FlexItem>
            {this.renderLeftSidebar()}
            <Detail
              _id={_id}
              queryParams={queryParams}
              pages={pages}
              loading={loading}
              handleItemSettings={this.handleItemSettings}
              type={type}
              settingsObject={settingsObject}
              onLoad={this.onLoad}
            />
          </FlexItem>
        </SiteFormContainer>
      </>
    );
  }
}

export default SiteForm;
