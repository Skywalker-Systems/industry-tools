import { Keypair } from '@solana/web3.js';
import { CharacterWallet, CharacterWallets, CreateSolanaWalletInput, WalletResponse } from "@utils/wallets";

export async function createSolanaWallet(input: CreateSolanaWalletInput): Promise<WalletResponse> {
    const { userId, characterId, network, storage } = input;
    try {
        const existingWalletData = await storage.getItem<CharacterWallets>(
            `USER#${userId}`,
            `WALLETS#${characterId}`
        );
        console.log(`existingWalletData: ${existingWalletData}`);

        let wallets = existingWalletData?.wallets || [];
        console.log(`wallets: ${wallets}`);
        const existingNetworkWallet = wallets.find(w => w.network === network);
        if (existingNetworkWallet) {
            console.log(`existingNetworkWallet: ${existingNetworkWallet}`);
            return {
                wallet: { address: existingNetworkWallet.address },
                message: "Existing wallet retrieved successfully"
            };
        }

        const wallet = Keypair.generate();
        console.log(`wallet: ${wallet}`);

        const secretKeyArray = Array.from(wallet.secretKey);
        console.log(`secretKeyArray: ${secretKeyArray}`);
        const newWallet: CharacterWallet = {
            privateKey: secretKeyArray,
            address: wallet.publicKey.toBase58(),
            network,
            createdAt: new Date().toISOString(),
            typename: "CharacterWallet"
        };
        console.log(`newWallet: ${newWallet}`);
        // Add the new wallet to the wallets array
        wallets.push(newWallet);
        console.log(`wallets: ${wallets}`);
        // Save the updated wallets array back to storage
        await storage.createItem(
            `USER#${userId}`,
            `WALLETS#${characterId}`,
            {
                ...existingWalletData,
                wallets: wallets
            }
        );

        const outputWallet = wallet.publicKey.toBase58();
        console.log(`outputWallet: ${outputWallet}`);

        return {
            wallet: { address: outputWallet },
            message: "Wallet created successfully"
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.name : 'WalletCreationError',
            message: `Failed to create wallet: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}
