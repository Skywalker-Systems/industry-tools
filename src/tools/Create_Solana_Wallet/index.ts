import { Keypair } from '@solana/web3.js';
import { Network } from '@utils/networks';
import { CharacterWallet, CharacterWallets, CreateSolanaWalletInput, WalletResponse } from "@utils/wallets";

export async function createSolanaWallet(input: CreateSolanaWalletInput): Promise<WalletResponse> {
    const { userId, characterId, network, storage } = input;
    try {
        const existingWalletData = await storage.getItem<CharacterWallets>(
            `USER#${userId}`,
            `WALLETS#${characterId}`
        );

        let wallets = existingWalletData?.wallets || [];
        const existingNetworkWallet = wallets.find(w => w.network === network);
        if (existingNetworkWallet) {
            return {
                wallet: { address: existingNetworkWallet.address },
                message: "Existing wallet retrieved successfully"
            };
        }

        const wallet = Keypair.generate();
        const secretKeyArray = Array.from(wallet.secretKey);

        const newWallet: CharacterWallet = {
            privateKey: secretKeyArray,
            address: wallet.publicKey.toBase58(),
            network: Network.solana,
            createdAt: new Date().toISOString(),
            typename: "CharacterWallet"
        };

        // Add the new wallet to the wallets array
        wallets.push(newWallet);

        // Save the updated wallets array back to storage
        await storage.createItem(
            `USER#${userId}`,
            `WALLETS#${characterId}`,
            {
                ...existingWalletData,
                wallets: wallets
            }
        );

        return {
            wallet: { address: wallet.publicKey.toBase58() },
            message: "Wallet created successfully"
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.name : 'WalletCreationError',
            message: `Failed to create wallet: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}
