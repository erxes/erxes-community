import { FeedLayout, Row, TabContent } from "../styles";
import { MainContainer, SideContainer } from "../../layout/styles";
import React, { useState } from "react";
import { TabTitle, Tabs } from "../../common/tabs";

import Form from "../containers/feed/Form";
import List from "../containers/feed/List";
import ThankForm from "../containers/feed/ThankForm";
import ThankList from "../containers/feed/ThankList";
import { Wrapper } from "../../layout";

type Props = {
  queryParams: any;
};

export default function Home(props: Props) {
  const [currentTab, setCurrentTab] = useState("post");
  const { queryParams } = props;

  const onClickTab = (type: string) => {
    setCurrentTab(type);
  };

  const renderTabContent = () => {
    if (currentTab === "thankyou") {
      return (
        <>
          <ThankForm queryParams={queryParams} />
          <ThankList queryParams={queryParams} />
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
        <Row>
          <MainContainer>
            <Tabs full={true}>
              <TabTitle
                className={currentTab === "post" ? "active" : ""}
                onClick={() => onClickTab("post")}
              >
                Post
              </TabTitle>
              <TabTitle
                className={currentTab === "event" ? "active" : ""}
                onClick={() => onClickTab("event")}
              >
                Event
              </TabTitle>
              <TabTitle
                className={currentTab === "bravo" ? "active" : ""}
                onClick={() => onClickTab("bravo")}
              >
                Bravo
              </TabTitle>
              <TabTitle
                className={currentTab === "publicHoliday" ? "active" : ""}
                onClick={() => onClickTab("publicHoliday")}
              >
                Public holiday
              </TabTitle>
            </Tabs>
            <TabContent>{renderTabContent()}</TabContent>
          </MainContainer>
          <SideContainer>hi</SideContainer>
        </Row>
      </FeedLayout>
    );
  };

  return (
    <Wrapper
      header={<Wrapper.Header title={"Feed"} />}
      content={renderContent()}
      transparent={true}
    />
  );
}
