import { ToolStorage } from "@storage/ToolStorage";
import { Network } from "./networks";

export type WalletResponse = {
    wallet: { address: string };
    message: string;
} | {
    error: string;
    message: string;
};

export type CharacterWallets = {
    wallets: CharacterWallet[];
};

export type CharacterWallet = {
    privateKey: string | number[]
    address: string;
    network: Network;
    createdAt: string;
    typename: "CharacterWallet";
};

export type CreateWalletInput = {
    userId: string;
    characterId: string;
    network: Network;
    storage: ToolStorage;
};