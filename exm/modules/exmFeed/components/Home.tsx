import { Col, FeedLayout, Row, TabContent } from "../styles";
import React, { useState } from "react";
import { TabTitle, Tabs } from "../../common/tabs";

import Form from "../containers/feed/Form";
import Icon from "../../common/Icon";
import LeftSidebar from "./LeftSidebar";
import Link from "next/link";
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
          <Col width={50}>
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
                Bravo{" "}
                <Link href={`/settings/properties?type=exmFeedBravo`}>
                  <a target="_blank">
                    <Icon color="black" icon="cog" />
                  </a>
                </Link>
              </TabTitle>
              <TabTitle
                className={currentTab === "thankyou" ? "active" : ""}
                onClick={() => onClickTab("thankyou")}
              >
                Thank you
              </TabTitle>
              <TabTitle
                className={currentTab === "publicHoliday" ? "active" : ""}
                onClick={() => onClickTab("publicHoliday")}
              >
                Public holiday
              </TabTitle>
            </Tabs>
            <TabContent>{renderTabContent()}</TabContent>
          </Col>
          <Col>hi</Col>
          <Col>hi</Col>
        </Row>
      </FeedLayout>
    );
  };

  return (
    <Wrapper
      header={
        <Wrapper.Header title={"Feed"} breadcrumb={[{ title: "Feed" }]} />
      }
      leftSidebar={<LeftSidebar />}
      content={renderContent()}
      hasBorder={true}
    />
  );
}
