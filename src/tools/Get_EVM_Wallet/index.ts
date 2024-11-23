import { ToolStorage } from "@storage/ToolStorage";
import { Network } from "@utils/networks";
import { ethers } from "ethers";

export type GetWalletInput = {
    userId: string;
    characterId: string;
    network: Network;
    storage: ToolStorage;
};

export async function getEVMWallet(input: GetWalletInput) {
    const { userId, characterId, network, storage } = input;
    try {
        const [wallet, rpc] = await Promise.all([
            storage.getItem<{ privateKey?: string }>(
                `USER#${userId}`,
                `WALLET#${characterId}`
            ),
            storage.getItem<{ httpEndpoint: string }>(
                "RPC",
                `CHAIN#${network}`
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
                message: `No RPC found for network ${network}`,
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
