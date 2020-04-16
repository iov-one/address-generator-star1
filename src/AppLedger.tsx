import { Address } from "@iov/bcp";
import { IovLedgerApp, isIovLedgerAppAddress, isIovLedgerAppVersion } from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Jumbo from "./Jumbo";
import Logo from "./Logo";

interface AddressResponse {
  readonly address: Address;
  readonly network: "mainnet" | "testnet";
}

async function getAddressFromLedger(transport: TransportWebUSB, index: number): Promise<AddressResponse> {
  const app = new IovLedgerApp(transport);
  const version = await app.getVersion();
  if (!isIovLedgerAppVersion(version)) throw new Error(version.errorMessage);
  const response = await app.getAddress(index);
  if (!isIovLedgerAppAddress(response)) throw new Error(response.errorMessage);

  return {
    address: response.address as Address,
    network: version.testMode ? "testnet" : "mainnet",
  };
}

async function showAddressInLedger(transport: TransportWebUSB, index: number): Promise<void> {
  const app = new IovLedgerApp(transport);
  const version = await app.getVersion();
  if (!isIovLedgerAppVersion(version)) throw new Error(version.errorMessage);
  const response = await app.getAddress(index, true);
  if (!isIovLedgerAppAddress(response)) throw new Error(response.errorMessage);
}

interface AppLedgerProps {
  readonly network: "mainnet" | "testnet";
}

interface AppLedgerState {
  readonly errorMessage: string | undefined;
  readonly address: string | undefined;
  readonly connectionOpen: boolean;
}

const emptyState: AppLedgerState = {
  errorMessage: undefined,
  address: undefined,
  connectionOpen: false,
};

class AppLedger extends React.Component<AppLedgerProps, AppLedgerState> {
  public constructor(props: AppLedgerProps) {
    super(props);
    this.state = {
      ...emptyState,
    };
  }

  public render(): JSX.Element {
    return (
      <Container className="mb-5">
        <Logo />
        <Jumbo title="IOV Ledger" network={this.props.network} />
        <Row>
          <Col>
            <h3>Use Ledger for address generation</h3>
            <p>
              Connect a Leder Nano S and continue. To be on the safe side, please confirm the address on the
              Ledger screen matches the one in your browser. You can repeat this operation as often as you
              like. Only one address will be generated.
            </p>
            <p className="text-center">
              <Button onClick={() => this.tryLedger()} disabled={this.state.connectionOpen}>
                Get my {this.props.network} address from Ledger Nano S
              </Button>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="danger" hidden={!this.state.errorMessage}>
              <p className="mb-0">{this.state.errorMessage}</p>
            </Alert>
            <Alert variant="success" hidden={!this.state.address}>
              <p className="mb-0">
                <strong>Your IOV address:</strong>
                <br />
                {this.state.address}
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  private async tryLedger(): Promise<void> {
    this.setState({ ...emptyState });

    const accountIndex = 0; // leads to m/44'/234'/0'
    let transport: TransportWebUSB | undefined;

    try {
      this.setState({ connectionOpen: true });
      transport = await TransportWebUSB.create(1000);
      const result = await getAddressFromLedger(transport, accountIndex);

      if (result.network !== this.props.network) {
        throw new Error(
          `Expected '${this.props.network}' but got response for '${result.network}'. Did you open the correct app on the Ledger?`,
        );
      }

      this.setState({
        address: result.address,
      });

      await showAddressInLedger(transport, accountIndex);

      await transport.close();
      this.setState({ connectionOpen: false });
    } catch (error) {
      console.warn(error);
      if (transport) await transport.close();
      this.setState({
        errorMessage: error instanceof Error ? error.message : error.toString(),
        connectionOpen: false,
      });
    }
  }
}

export default AppLedger;
