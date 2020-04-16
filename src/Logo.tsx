import React from "react";
import { Link } from "react-router-dom";

import iovLogo from "./assets/iov-logo.svg";

class Logo extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Link to="/">
        <img alt="IOV logo" src={iovLogo} height={56} />
      </Link>
    );
  }
}

export default Logo;
