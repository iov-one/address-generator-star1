import { Address, ChainId } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { EnglishMnemonic } from "@iov/crypto";
import { Ed25519HdWallet, HdPaths } from "@iov/keycontrol";

export type Network = "mainnet" | "testnet";

function chainIdForAddress(network: "mainnet" | "testnet"): ChainId {
  if (network === "mainnet") return "iov-mainnet" as ChainId;
  else return "iov-lovenet" as ChainId; // any testnet chain ID is fine. We just need it for the address prefix
}

export async function makeAddress(mnemonic: EnglishMnemonic, network: Network): Promise<Address> {
  const wallet = Ed25519HdWallet.fromMnemonic(mnemonic.toString());
  const chainId = chainIdForAddress(network);
  const identity = await wallet.createIdentity(chainId, HdPaths.iov(0));
  return bnsCodec.identityToAddress(identity);
}
