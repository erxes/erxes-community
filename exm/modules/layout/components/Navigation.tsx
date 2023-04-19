import { HelpBox, LeftNavigation, Sidebar } from "../styles";

import Button from "../../common/Button";
import Icon from "../../common/Icon";
import { MAIN_NAVIGATION } from "../constants";
import React from "react";
import { __ } from "../../../utils";

type Props = {
  // navCollapse: number;
};

type State = {
  activeClass: string;
};

export default class LeftSidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeClass: "feed",
    };
  }

  onClick = (activeClass) => {
    this.setState({ activeClass });
  };

  render() {
    const { activeClass } = this.state;

    return (
      <LeftNavigation>
        <div className="image-wrapper">
          <img src="/static/logos/erxes-logo.svg" alt="logo" />
        </div>
        <Sidebar>
          {MAIN_NAVIGATION.map((item: any, i: number) => (
            <li
              className={item.key === activeClass ? "active" : ""}
              key={i}
              onClick={() => this.onClick(item.key)}
            >
              <Icon className={item.key} icon={item.icon} size={18} />
              <span>{item.value}</span>
            </li>
          ))}
        </Sidebar>
        <HelpBox>
          <div className="icon-wrapper">
            <Icon icon="question-circle" size={22} />
          </div>
          <b>{__("Need help?")}</b>
          <p>{__("Please check our docs")}</p>
          <Button size="small">Documentation</Button>
        </HelpBox>
      </LeftNavigation>
    );
  }
}
