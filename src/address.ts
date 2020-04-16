import { CosmWasmCodec } from "@cosmwasm/bcp";
import { Address, ChainId } from "@iov/bcp";
import { EnglishMnemonic } from "@iov/crypto";
import { HdPaths, Secp256k1HdWallet } from "@iov/keycontrol";

export type Network = "mainnet" | "testnet";

function chainIdForAddress(network: "mainnet" | "testnet"): ChainId {
  if (network === "mainnet") return "iov-mainnet-2" as ChainId;
  else return "iov-lovenet" as ChainId; // any testnet chain ID is fine. We just need it for the address prefix
}

export async function makeAddress(mnemonic: EnglishMnemonic, network: Network): Promise<Address> {
  const wallet = Secp256k1HdWallet.fromMnemonic(mnemonic.toString());
  const chainId = chainIdForAddress(network);
  const identity = await wallet.createIdentity(chainId, HdPaths.iov(0));
  const addressPefix = network === "mainnet" ? "star" : "tstar";
  const bankTokens = [
    {
      fractionalDigits: 9,
      name: "Internet Of Value Token",
      ticker: "IOV",
      denom: "niov",
    },
  ];
  const cosmwasmCodec = new CosmWasmCodec(addressPefix, bankTokens);
  return cosmwasmCodec.identityToAddress(identity);
}
