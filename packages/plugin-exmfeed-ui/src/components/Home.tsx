import { Col, FeedLayout, TabContent } from '../styles';
import React, { useState } from 'react';
import { TabTitle, Tabs } from '@erxes/ui/src/components/tabs/index';

import Form from '../containers/feed/Form';
import Icon from '@erxes/ui/src/components/Icon';
import LeftSidebar from './LeftSidebar';
import { Link } from 'react-router-dom';
import List from '../containers/feed/List';
import { Row } from '@erxes/ui-settings/src/styles';
import ThankForm from '../containers/feed/ThankForm';
import ThankList from '../containers/feed/ThankList';
import { Wrapper } from '@erxes/ui/src/layout';

type Props = {
  queryParams: any;
};

export default function Home(props: Props) {
  const [currentTab, setCurrentTab] = useState('post');
  const { queryParams } = props;

  const onClickTab = (type: string) => {
    setCurrentTab(type);
  };

  const renderTabContent = () => {
    if (currentTab === 'thankyou') {
      return (
        <>
          <ThankForm queryParams={queryParams} />
          <ThankList queryParams={queryParams} />
        </>
      );
    }

    if (currentTab === 'welcome') {
      return (
        <>
          <List queryParams={queryParams} contentType={currentTab} />
        </>
      );
    }

    return (
      <>
        <Form contentType={currentTab} />
        <List queryParams={queryParams} contentType={currentTab} />
      </>
    );
  };

  const renderContent = () => {
    return (
      <FeedLayout>
        <Tabs full={true}>
          <TabTitle
            className={currentTab === 'post' ? 'active' : ''}
            onClick={() => onClickTab('post')}
          >
            Post
          </TabTitle>
          <TabTitle
            className={currentTab === 'event' ? 'active' : ''}
            onClick={() => onClickTab('event')}
          >
            Event
          </TabTitle>
          <TabTitle
            className={currentTab === 'bravo' ? 'active' : ''}
            onClick={() => onClickTab('bravo')}
          >
            Bravo{' '}
            <Link target="_blank" to={`/settings/properties?type=exmFeedBravo`}>
              <Icon color="black" icon="cog" />
            </Link>
          </TabTitle>
          <TabTitle
            className={currentTab === 'thankyou' ? 'active' : ''}
            onClick={() => onClickTab('thankyou')}
          >
            Thank you
          </TabTitle>
          <TabTitle
            className={currentTab === 'publicHoliday' ? 'active' : ''}
            onClick={() => onClickTab('publicHoliday')}
          >
            Public holiday
          </TabTitle>
          <TabTitle
            className={currentTab === 'welcome' ? 'active' : ''}
            onClick={() => onClickTab('welcome')}
          >
            Welcome
          </TabTitle>
        </Tabs>
        <TabContent>{renderTabContent()}</TabContent>
      </FeedLayout>
    );
  };

  return (
    <Wrapper
      header={
        <Wrapper.Header title={'Feed'} breadcrumb={[{ title: 'Feed' }]} />
      }
      leftSidebar={<LeftSidebar />}
      content={renderContent()}
      hasBorder={true}
    />
  );
}
