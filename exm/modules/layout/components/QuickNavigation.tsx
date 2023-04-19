import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "../../common/DropdownToggle";
import { IUser } from "../../auth/types";
import Icon from "../../common/Icon";
import Link from "next/link";
import ModalTrigger from "../../common/ModalTrigger";
import React from "react";
import Search from "../containers/Search";
import { __ } from "../../../utils";
import { colors } from "../../styles";
import styled from "styled-components";

const UserHelper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    float: none;
    margin: 0 5px 0 0;
  }

  i {
    width: 10px;
  }
`;

export const NavItem = styled.div`
  padding-left: 18px;
  display: table-cell;
  vertical-align: middle;

  > a {
    color: ${colors.textSecondary};
    display: flex;
    align-items: center;

    &:hover {
      color: ${colors.colorSecondary};
    }
  }

  .dropdown-menu {
    min-width: 240px;
  }
`;

const QuickNavigation = ({ currentUser }: { currentUser: IUser }) => {
  return (
    <nav id={"SettingsNav"}>
      <NavItem>
        <Search />
      </NavItem>
      <NavItem>
        <Dropdown alignRight={true}>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-user">
            <UserHelper>
              <UserInfo>
                hi
                <Icon icon="angle-down" size={14} />
              </UserInfo>
            </UserHelper>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <li>
              <Link href="/profile">{__("My Profile")}</Link>
            </li>

            <Dropdown.Divider />
            <Dropdown.Item>{__("Sign out")}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </NavItem>
    </nav>
  );
};

export default QuickNavigation;
