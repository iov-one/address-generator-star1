import { Bip39, EnglishMnemonic, Random } from "@iov/crypto";
import copy from "clipboard-copy";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Scroll from "react-scroll";

import { makeAddress } from "./address";
import Jumbo from "./Jumbo";
import MnemonicInput from "./MnemonicInput";

interface AppProps {
  readonly network: "mainnet" | "testnet";
}

interface AppState {
  readonly words: readonly string[];
  readonly mnemonicVerificationErrorMessage: string | undefined;
  readonly address: string | undefined;
}

function wordCountOk(count: number): boolean {
  return count === 12 || count === 15 || count === 18 || count === 21 || count === 24;
}

const emptyState: AppState = {
  words: [],
  mnemonicVerificationErrorMessage: undefined,
  address: undefined,
};

class App extends React.Component<AppProps, AppState> {
  public constructor(props: AppProps) {
    super(props);
    this.state = {
      ...emptyState,
    };
  }

  public componentDidUpdate(): void {
    if (this.state.address) Scroll.animateScroll.scrollToBottom();
  }

  public render(): JSX.Element {
    return (
      <Container className="mb-5">
        <Jumbo title="Starname Network Address Generator" network={this.props.network} />
        <Row>
          <Col>
            <h4>Enter your mnemonic:</h4>
            <p>
              We support English BIP39 mnemonics between 12 and 24 words. The mnemonic represents your private
              key, which only you should know. If you lose it then you will not be able to access your account
              any more.
            </p>
            <div>
              <div className="d-flex justify-content-end">
                <button onClick={() => this.generateNewRandomMnemonic()} className="btn btn-link btn-sm">
                  Generate random
                </button>
                <button onClick={() => this.copyMnemonic()} className="btn btn-link btn-sm">
                  Copy
                </button>
                <button onClick={() => this.clearMnemonic()} className="btn btn-link btn-sm">
                  Clear
                </button>
              </div>
              <MnemonicInput
                ref="MnemonicInput1"
                id="input1"
                onWordsChanged={words => {
                  this.setState({
                    words: words,
                    address: undefined,
                    mnemonicVerificationErrorMessage: undefined,
                  });
                }}
              />
              <div className="d-flex justify-content-between mt-2">
                <p className="small">{this.state.words.length} words entered.</p>
              </div>

              <Alert
                variant="danger"
                dismissible={true}
                role="alert"
                hidden={!this.state.mnemonicVerificationErrorMessage}
              >
                {this.state.mnemonicVerificationErrorMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => this.setState({ mnemonicVerificationErrorMessage: undefined })}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Alert>
            </div>
            <p className="text-center">
              <Button
                disabled={!wordCountOk(this.state.words.length)}
                onClick={() => this.makeAddress()}
                className="btn-lg"
              >
                Show my {this.props.network} address
              </Button>
            </p>
          </Col>
        </Row>
        <Row hidden={!this.state.address}>
          <Col>
            <Alert variant="success">
              <p className="mb-0">
                <strong>Your Starname network address:</strong>
                <br />
                {this.state.address}
              </p>
            </Alert>
            <Alert variant="warning">
              <p className="mb-0">
                This browser tab contains sensitive information in memory. Please close it as soon as you
                record your mnemonic.
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  private async makeAddress(): Promise<void> {
    const answer = prompt("Did you store the mnemonic in a secure location? If yes then please type 'yes'.");
    if ((answer || "").trim().toLowerCase() !== "yes") {
      return;
    }

    try {
      const confirmed = new EnglishMnemonic(this.state.words.join(" "));

      this.setState({
        address: await makeAddress(confirmed, this.props.network),
      });
    } catch (error) {
      this.setState({
        mnemonicVerificationErrorMessage: `${error.toString()}. Please check your mnemonic carefully.`,
      });
    }
  }

  private copyMnemonic(): void {
    const mnemonic = this.state.words.join(" ");
    copy(mnemonic);
  }

  private async clearMnemonic(): Promise<void> {
    (this.refs.MnemonicInput1 as MnemonicInput).setWords([]);
  }

  private async generateNewRandomMnemonic(): Promise<void> {
    const randomWords = Bip39.encode(await Random.getBytes(16))
      .toString()
      .split(" ");

    (this.refs.MnemonicInput1 as MnemonicInput).setWords(randomWords);
  }
}

export default App;
