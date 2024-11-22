export type WalletResponse = {
    wallet_data: { address: string };
    message: string;
} | {
    error: string;
    message: string;
};

export type CharacterWallet = {
    privateKey: string;
    address: string;
    createdAt: string;
    typename: "CharacterWallet";
};