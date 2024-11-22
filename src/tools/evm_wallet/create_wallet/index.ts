import { ToolStorage } from "@storage/ToolStorage";
import { Wallet } from "ethers";
import { CharacterWallet, WalletResponse } from "..";



type CreateWalletParams = {
    userId: string;
    characterId: string;
};

export async function createWallet({
    userId,
    characterId,
}: CreateWalletParams,
    storage: ToolStorage
): Promise<WalletResponse> {
    try {
        const existingWallet = await storage.getItem<CharacterWallet>(
            `USER#${userId}`,
            `WALLET#${characterId}`
        );

        if (existingWallet?.privateKey) {
            const wallet = new Wallet(existingWallet.privateKey);
            return {
                wallet_data: { address: wallet.address },
                message: "Existing wallet retrieved successfully"
            };
        }

        const wallet = Wallet.createRandom();
        await storage.createItem(
            `USER#${userId}`,
            `WALLET#${characterId}`,
            { privateKey: wallet.privateKey, address: wallet.address, createdAt: new Date().toISOString(), typename: "CharacterWallet" }
        );

        return {
            wallet_data: { address: wallet.address },
            message: "Wallet created successfully"
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.name : 'WalletCreationError',
            message: `Failed to create wallet: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

