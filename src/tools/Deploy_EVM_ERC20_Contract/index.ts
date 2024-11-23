import { ToolStorage } from "@storage/ToolStorage";
import { Network } from "@utils/networks";
import { ethers } from "ethers";
import { ERC20_CONTRACT_ABI, ERC20_CONTRACT_BYTECODE } from "../../utils/contracts/erc20";

export type DeployContractInput = {
    userId: string;
    characterId: string;
    tokenName: string;
    tokenSymbol: string;
    totalSupply: string;
    network: Network;
    storage: ToolStorage;
};

export async function deployContract(input: DeployContractInput) {
    const { userId, characterId, tokenName, tokenSymbol, totalSupply, network, storage } = input;
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
            tokenName,
            tokenSymbol,
            totalSupply
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