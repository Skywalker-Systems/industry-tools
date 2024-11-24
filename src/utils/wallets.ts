import { ToolStorage } from "@storage/ToolStorage";
import { Network } from "./networks";

export type WalletResponse = {
    wallet: { address: string };
    message: string;
} | {
    error: string;
    message: string;
};

export type GetWalletSuccess = {
    wallet: {
        address: string;
    };
    message: "Wallet data retrieved successfully";
};

export type GetWalletError = {
    error: "WalletNotFound" | "RPCNotFound" | "WalletError";
    message: string;
};

export type GetEVMWalletInput = {
    userId: string;
    characterId: string;
    network?: Network;
    storage: ToolStorage;
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

export type CreateEVMWalletInput = {
    userId: string;
    characterId: string;
    network: Network;
    storage: ToolStorage;
};

export type CreateSolanaWalletInput = {
    userId: string;
    characterId: string;
    network: Network.SOLANA;
    storage: ToolStorage;
};