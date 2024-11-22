import { ToolStorage } from "@storage/ToolStorage";
import { ethers } from "ethers";

export async function getWallet(
    userId: string,
    characterId: string,
    chainId: number,
    storage: ToolStorage
) {
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
            wallet_data: {
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
