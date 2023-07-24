import { IUser } from "../../auth/types";
import QuickNavigation from "../components/QuickNavigation";
import React from "react";

type Props = {
  currentUser: IUser;
};

type State = {};

class QuickNavigationContainer extends React.Component<Props, State> {
  render() {
    const { currentUser } = this.props;

    return <QuickNavigation currentUser={currentUser} />;
  }
}

const WithUser = QuickNavigationContainer;

export default WithUser;
