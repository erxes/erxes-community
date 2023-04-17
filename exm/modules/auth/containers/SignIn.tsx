import ButtonMutate from "../../common/ButtonMutate";
import { IButtonMutateProps } from "../../common/types";
import { IRouterProps } from "../../types";
import React from "react";
import SignIn from "../components/SignIn";
import { __ } from "../../../utils";
import apolloClient from "../../apolloClient";
import { mutations } from "../graphql";
// import { withRouter } from "react-router-dom";

const SignInContainer = (props: IRouterProps) => {
  const { history = {} } = props;

  const renderButton = ({ values, isSubmitted }: IButtonMutateProps) => {
    const callbackResponse = () => {
      apolloClient.resetStore();

      history.push("/?signedIn=true");

      window.location.reload();
    };

    return (
      <ButtonMutate
        mutation={mutations.login}
        variables={values}
        callback={callbackResponse}
        isSubmitted={isSubmitted}
        type="submit"
        btnStyle="default"
        block={true}
        icon="none"
      >
        {__("Sign in")}
      </ButtonMutate>
    );
  };

  const updatedProps = {
    ...props,
    renderButton,
  };

  return <SignIn {...updatedProps} />;
};

export default SignInContainer;
