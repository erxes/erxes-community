import { Tabs, TabTitle } from '@erxes/ui/src/components/tabs';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import DetailContainer from '../accounts/containers/Detail';

type Props = {
  history?: any;
  queryParams: any;
};

const Detail = (props: Props) => {
  const { queryParams } = props;

  const serviceTypes = ['account', 'transactions', 'payments', 'rates'];

  const [currentTab, setCurrentTab] = React.useState<string>(serviceTypes[0]);

  const tabOnClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const renderContent = () => {
    if (currentTab === 'account') {
      return <DetailContainer queryParams={queryParams} />;
    }

    return <>{currentTab}</>;
  };

  const renderTabs = () => {
    if (!queryParams._id) {
      return <>please select corporate gateway</>;
    }

    if (!queryParams._id || !queryParams.account) {
      return <>please select account</>;
    }

    return (
      <>
        <Tabs full={true}>
          {Object.values(serviceTypes).map((type, index) => (
            <TabTitle
              key={index}
              className={currentTab === type ? 'active' : ''}
              onClick={() => tabOnClick(type)}
            >
              {__(type)}
            </TabTitle>
          ))}
        </Tabs>
        {renderContent()}
      </>
    );
  };

  return renderTabs();
};

export default Detail;
