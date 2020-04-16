import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";

import Logo from "./Logo";

interface JumboProps {
  readonly title: string;
  readonly network?: "mainnet" | "testnet";
}

class Jumbo extends React.Component<JumboProps, {}> {
  public render(): JSX.Element {
    return (
      <Row>
        <Col>
          <Jumbotron style={{ marginBottom: "0.5em", marginTop: "0.5em", padding: "1em" }}>
            <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 className="d-inline mr-2 pull-left">
                {this.props.title}
                &nbsp;
                <small className="badge badge-sm badge-primary align-top" hidden={!this.props.network}>
                  {this.props.network}
                </small>
              </h3>
              <span className="pull-right">
                <Logo />
              </span>
            </Container>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}

export default Jumbo;
