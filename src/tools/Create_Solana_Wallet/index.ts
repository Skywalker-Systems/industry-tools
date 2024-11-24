import { Keypair } from '@solana/web3.js';
import { CharacterWallet, CharacterWallets, CreateSolanaWalletInput, WalletResponse } from "@utils/wallets";
import { Network } from '../../utils/networks';

export async function createSolanaWallet(input: CreateSolanaWalletInput): Promise<WalletResponse> {
    const { userId, characterId, storage } = input;
    try {
        const existingWalletData = await storage.getItem<CharacterWallets>(
            `USER#${userId}`,
            `WALLETS#${characterId}`
        );

        let wallets = existingWalletData?.wallets || [];
        const existingNetworkWallet = wallets.find(w => w.network === Network.SOLANA);
        if (existingNetworkWallet) {
            console.log(`existingNetworkWallet: ${existingNetworkWallet}`);
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
            network: Network.SOLANA,
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

        const outputWallet = wallet.publicKey.toBase58();

        return {
            wallet: { address: outputWallet },
            message: "Wallet created successfully"
        };
    } catch (error) {
        console.log(error);
        return {
            error: 'WalletCreationError',
            message: `Failed to create wallet: ${error}`
        };
    }
}
