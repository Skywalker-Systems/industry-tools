import { ToolStorage } from "@storage/ToolStorage";
import { ethers } from "ethers";

export type GetWalletInput = {
    userId: string;
    characterId: string;
    chainId: number;
    storage: ToolStorage;
};

export async function getWallet(input: GetWalletInput) {
    const { userId, characterId, chainId, storage } = input;
    try {
        const [wallet, rpc] = await Promise.all([
            storage.getItem<{ privateKey?: string }>(
                `USER#${userId}`,
                `WALLET#${characterId}`
            ),
            storage.getItem<{ httpEndpoint: string }>(
                "RPC",
                `CHAIN#${chainId}`
            )
        ]);

        if (!wallet || !wallet.privateKey) {
            return {
                error: "WalletNotFound",
                message: `No wallet found for character ${characterId}`,
            };
        }

        if (!rpc) {
            return {
                error: "RPCNotFound",
                message: `No RPC found for chain ${chainId}`,
            };
        }

        const provider = new ethers.JsonRpcProvider(rpc.httpEndpoint);
        const signer = new ethers.Wallet(wallet.privateKey, provider);

        return {
            message: "Wallet data retrieved successfully",
            wallet: {
                address: signer.address,
            },
        };
    } catch (error: any) {
        return {
            error: error.name || "WalletError",
            message: `Failed to retrieve wallet data: ${error.message}`,
        };
    }
}
