import { CharacterWallet, CharacterWallets, CreateEVMWalletInput } from "@utils/wallets";
import { Wallet } from "ethers";

export async function createEVMWallet(input: CreateEVMWalletInput): Promise<{
    wallet?: { address: string };
    message: string;
    error?: string;
}> {
    const { userId, characterId, network, storage } = input;
    try {
        // Fetch the existing CharacterWallet from storage
        const existingWalletData = await storage.getItem<CharacterWallets>(
            `USER#${userId}`,
            `WALLETS#${characterId}`
        );

        // Initialize the wallets array
        let wallets = existingWalletData?.wallets || [];

        // Check if a wallet for the specified network already exists
        const existingNetworkWallet = wallets.find(w => w.network === network);

        if (existingNetworkWallet) {
            return {
                wallet: { address: existingNetworkWallet.address },
                message: "Existing wallet retrieved successfully"
            };
        }

        // Create a new wallet
        const wallet = Wallet.createRandom();

        // Create a new wallet object
        const newWallet: CharacterWallet = {
            privateKey: wallet.privateKey,
            address: wallet.address,
            network: network,
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
