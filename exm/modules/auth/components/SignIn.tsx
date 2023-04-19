import { AuthBox } from "../styles";
import Form from "../../common/form/Form";
import FormControl from "../../common/form/Control";
import FormGroup from "../../common/form/Group";
import { IButtonMutateProps } from "../../common/types";
import Link from "next/link";
import React from "react";
import _ from "lodash";
import { __ } from "../../../utils";
import { getThemeItem } from "../../utils";
import { readFile } from "../../common/utils";

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class SignIn extends React.Component<Props> {
  renderContent = (formProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <FormControl
            {...formProps}
            name="email"
            type="email"
            placeholder={__("Enter your email")}
            required={true}
          />
        </FormGroup>

        <FormGroup>
          <FormControl
            {...formProps}
            name="password"
            type="password"
            placeholder={__("Enter your password")}
            required={true}
          />
        </FormGroup>

        {this.props.renderButton({
          values,
          isSubmitted,
        })}
      </>
    );
  };

  renderLogo() {
    const logo = "/images/logo-dark.png";
    const thLogo = getThemeItem("logo");
    return thLogo ? readFile(thLogo) : logo;
  }

  render() {
    return (
      <AuthBox>
        <img src={this.renderLogo()} alt="erxes" />
        <h2>{__("Welcome!")}</h2>
        <p>{__("Please sign in to your account to continue")}</p>
        <Form renderContent={this.renderContent} />
        <Link href="/forgot-password">{__("Forgot password?")}</Link>
      </AuthBox>
    );
  }
}

export default SignIn;
