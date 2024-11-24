import { Network } from "@utils/networks";
import { CharacterWallet, CharacterWallets, CreateEVMWalletInput, WalletResponse } from "@utils/wallets";
import { Wallet } from "ethers";

export async function createEVMWallet(input: CreateEVMWalletInput): Promise<WalletResponse> {
    const { userId, characterId, network, storage } = input;
    try {
        const existingWalletData = await storage.getItem<CharacterWallets>(
            `USER#${userId}`,
            `WALLETS#${characterId}`
        );

        let wallets = existingWalletData?.wallets || [];
        const existingNetworkWallet = wallets.find(w => w.network.toUpperCase() === network.toUpperCase());
        if (existingNetworkWallet) {
            return {
                wallet: { address: existingNetworkWallet.address },
                message: "Existing wallet retrieved successfully"
            };
        }

        const wallet = Wallet.createRandom();
        const newWallet: CharacterWallet = {
            privateKey: wallet.privateKey,
            address: wallet.address,
            network: network.toUpperCase() as Network,
            createdAt: new Date().toISOString(),
            typename: "CharacterWallet"
        };

        wallets.push(newWallet);

        await storage.createItem(
            `USER#${userId}`,
            `WALLETS#${characterId}`,
            {
                ...existingWalletData,
                wallets: wallets
            }
        );

        return {
            wallet: { address: wallet.address },
            message: "Wallet created successfully"
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.name : 'WalletCreationError',
            message: `Failed to create wallet: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}
