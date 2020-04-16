import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";

interface JumboProps {
  readonly title: string;
  readonly network?: "mainnet" | "testnet";
}

class Jumbo extends React.Component<JumboProps, {}> {
  public render(): JSX.Element {
    return (
      <Row>
        <Col>
          <Jumbotron>
            <Container>
              <h2>
                <span className="display-3 d-inline-block mr-2">{this.props.title}</span>
                <small className="badge badge-sm badge-primary align-top" hidden={!this.props.network}>
                  {this.props.network}
                </small>
              </h2>
              <p className="mb-0">
                Here you can generate an IOV address
                <span hidden={!this.props.network}> for {this.props.network}</span>.
              </p>
            </Container>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}

export default Jumbo;
