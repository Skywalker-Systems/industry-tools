import { ToolStorage } from "@storage/ToolStorage";
import { ethers } from "ethers";
import { ERC20_CONTRACT_ABI, ERC20_CONTRACT_BYTECODE } from "../contracts/erc20";


interface DeploymentParams {
    sessionId: string;
    userId: string;
    characterId: string;
    tokenName: string;
    tokenSymbol: string;
    totalSupply: string;
    network: string;
}

export async function deployContract(
    params: DeploymentParams,
    storage: ToolStorage
) {
    try {
        const network = params.network

        const [wallet, rpc] = await Promise.all([
            storage.getItem<{ privateKey?: string }>(
                `USER#${params.userId}`,
                `WALLET#${params.characterId}`
            ),
            storage.getItem<{ httpEndpoint: string }>(
                "RPC",
                `CHAIN#${network}`
            )
        ]);

        if (!wallet?.privateKey) {
            return {
                error: 'WalletNotFound',
                message: 'No wallet found for this character'
            };
        }

        if (!rpc?.httpEndpoint) {
            return {
                error: 'RPCNotFound',
                message: 'No RPC found for this network'
            };
        }

        const provider = new ethers.JsonRpcProvider(rpc?.httpEndpoint);
        const signer = new ethers.Wallet(wallet.privateKey, provider);
        const factory = new ethers.ContractFactory(
            ERC20_CONTRACT_ABI,
            ERC20_CONTRACT_BYTECODE,
            signer
        );

        const contract = await factory.deploy(
            params.tokenName,
            params.tokenSymbol,
            params.totalSupply
        );

        await contract.waitForDeployment();
        const deployedAddress = await contract.getAddress();

        return {
            contractAddress: deployedAddress,
            network
        };

    } catch (error) {
        return {
            error: error instanceof Error ? error.name : 'DeploymentError',
            message: `Failed to deploy contract: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}