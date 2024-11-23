import { ToolStorage } from "@storage/ToolStorage";
import { Network } from "@utils/networks";
import { CharacterWallet, WalletResponse } from "@utils/wallets";
import { Wallet } from "ethers";

export type CreateWalletInput = {
    userId: string;
    characterId: string;
    network: Network;
    storage: ToolStorage;
};

export async function createWallet(input: CreateWalletInput): Promise<WalletResponse> {
    const { userId, characterId, network, storage } = input;
    try {
        const existingWallet = await storage.getItem<CharacterWallet>(
            `USER#${userId}`,
            `WALLET#${characterId}`
        );

        if (existingWallet?.privateKey) {
            const wallet = new Wallet(existingWallet.privateKey);
            return {
                wallet: { address: wallet.address },
                message: "Existing wallet retrieved successfully"
            };
        }

        const wallet = Wallet.createRandom();
        await storage.createItem(
            `USER#${userId}`,
            `WALLET#${characterId}`,
            { privateKey: wallet.privateKey, address: wallet.address, network: network, createdAt: new Date().toISOString(), typename: "CharacterWallet" }
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

