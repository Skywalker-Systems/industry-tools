import createEVMWallet from '../tools/Create_EVM_Wallet/spec.json';
import createSolanaWallet from '../tools/Create_Solana_Wallet/spec.json';
import deployEVMERC20Contract from '../tools/Deploy_EVM_ERC20_Contract/spec.json';
import getEVMWallet from '../tools/Get_EVM_Wallet/spec.json';

export const specs: Record<string, any> = {
    "Create_EVM_Wallet": createEVMWallet,
    "Get_EVM_Wallet": getEVMWallet,
    "Deploy_EVM_ERC20_Contract": deployEVMERC20Contract,
    "Create_Solana_Wallet": createSolanaWallet,
}

export const fetchSpec = (toolName: string) => {
    try {
        const spec = specs[toolName as keyof typeof specs];
        return spec;
    } catch (error) {
        throw new Error(`Failed to load spec for tool "${toolName}": ${error}`);
    }
};
