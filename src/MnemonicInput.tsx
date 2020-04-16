import { EnglishMnemonic } from "@iov/crypto";
import React from "react";
import { Typeahead, TypeaheadModel } from "react-bootstrap-typeahead";

const wordlist = [...EnglishMnemonic.wordlist]; // create copy of correct type

interface MnemonicInputProps {
  readonly id: string;
  readonly onWordsChanged?: (words: readonly string[]) => void;
}

interface MnemonicInputState {
  readonly words: readonly string[];
}

interface PrivateTypeahead<T extends TypeaheadModel> extends Typeahead<T> {
  readonly clear: () => void;
  readonly _updateSelected: (selected: T[]) => void;
}

class MnemonicInput extends React.Component<MnemonicInputProps, MnemonicInputState> {
  private typeahead: PrivateTypeahead<string> | null = null;

  public constructor(props: MnemonicInputProps) {
    super(props);
    this.state = {
      words: [],
    };
  }

  public setWords(words: readonly string[]): void {
    if (!this.typeahead) return;

    this.typeahead.clear();
    this.typeahead._updateSelected([...words]);
  }

  public render(): JSX.Element {
    return (
      <div>
        <Typeahead
          id={this.props.id}
          multiple={true}
          bsSize="lg"
          ref={ref => (this.typeahead = ref as PrivateTypeahead<string>)}
          onChange={selected => {
            this.setState({ words: selected });
            this.props.onWordsChanged && this.props.onWordsChanged(selected);
          }}
          onInputChange={input => {
            if (!this.typeahead) return;

            // Process input if some whitespace included
            if (input.search(/\s+/) !== -1) {
              const oldWords = this.state.words;
              const newWords = input
                .trim()
                .split(/\s+/)
                .filter(Boolean);

              this.typeahead.setState({ text: "" });
              this.typeahead._updateSelected([...oldWords, ...newWords]);
            }
          }}
          selectHintOnEnter={true}
          options={wordlist}
          filterBy={(option, props) => {
            const normalized = props.text.trim().toLowerCase();
            return option.startsWith(normalized);
          }}
        />
      </div>
    );
  }
}

export default MnemonicInput;
