import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import Jumbo from "./Jumbo";

interface StartProps {}

class Start extends React.Component<StartProps, {}> {
  public render(): JSX.Element {
    return (
      <Container>
        <Jumbo title="Starname Network Address Generator" />
        <Row>
          <Col>
            <p>&nbsp;</p>
          </Col>
        </Row>
        <Row>
          <Col className=""></Col>
          <Col className="col-4">
            <Link to="/mainnet" className="btn btn-lg btn-block btn-primary">
              Generate your star1 prefixed address
            </Link>
          </Col>
          <Col className=""></Col>
        </Row>
      </Container>
    );
  }
}

export default Start;
