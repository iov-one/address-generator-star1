import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import iovLogo from "./assets/iov-logo.svg";

class Header extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Row>
        <Col>
          <Link to="/">
            <img className="mt-3 mb-3" alt="IOV logo" src={iovLogo} height={56} />
          </Link>
        </Col>
      </Row>
    );
  }
}

export default Header;
