import { GetEVMWalletInput } from "@utils/wallets";
import { ethers } from "ethers";

export async function getEVMWallet(input: GetEVMWalletInput) {
    const { userId, characterId, network, storage } = input;
    try {
        const [wallet, rpc] = await Promise.all([
            storage.getItem<{ privateKey?: string }>(
                `USER#${userId}`,
                `WALLET#${characterId}`
            ),
            storage.getItem<{ httpEndpoint: string }>(
                "RPC",
                `CHAIN#${network?.toUpperCase()}`
            )
        ]);

        if (!wallet || !wallet.privateKey) {
            return {
                error: "WalletNotFound",
                message: `No wallet found for character ${characterId}`,
                address: "",
            };
        }

        if (!rpc) {
            return {
                error: "RPCNotFound",
                message: `No RPC found for network ${network}`,
                address: "",
            };
        }

        const provider = new ethers.JsonRpcProvider(rpc.httpEndpoint);
        const signer = new ethers.Wallet(wallet.privateKey, provider);

        return {
            message: `Wallet found with address ${signer.address}`,
            error: "",
            address: signer.address,
        };
    } catch (error) {
        console.log(error);
        return {
            error: "WalletError",
            message: `Failed to retrieve wallet data: ${error instanceof Error ? error.message : String(error)}`,
            address: "",
        };
    }
}
