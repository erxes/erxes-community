import Icon from '@erxes/ui/src/components/Icon';
import { LEFT_SIDEBAR } from '../constants';
import React from 'react';
import { Sidebar } from '../styles';

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
      activeClass: 'feed'
    };
  }

  onClick = activeClass => {
    this.setState({ activeClass });
  };

  render() {
    const { activeClass } = this.state;

    return (
      <Sidebar>
        {LEFT_SIDEBAR.map((item: any, i: number) => (
          <li
            className={item.key === activeClass ? 'active' : ''}
            key={i}
            onClick={() => this.onClick(item.key)}
          >
            <Icon className={item.key} icon={item.icon} size={22} />
            <span>{item.value}</span>
          </li>
        ))}
      </Sidebar>
    );
  }
}
