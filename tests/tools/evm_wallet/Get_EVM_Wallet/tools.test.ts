import { expect } from "chai";
import { ToolStorage } from "../../../../src/storage/ToolStorage";
import { getEVMWallet } from "../../../../src/tools/Get_EVM_Wallet";
import { Network } from "../../../../src/utils/networks";

describe("getWallet", () => {
    const mockStorage = {
        getItem: async (pk: string, sk: string) => {
            if (pk === "USER#user_123" && sk === "WALLET#char_123") {
                return { privateKey: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" };
            }
            if (pk === "RPC" && sk === "CHAIN#base") {
                return { httpEndpoint: "https://base.example.com" };
            }
            return null;
        },
    } as ToolStorage;

    it("should retrieve wallet data successfully", async () => {
        const result = await getEVMWallet({
            userId: "user_123",
            characterId: "char_123",
            network: Network.base,
            storage: mockStorage
        });

        if ('error' in result) {
            throw new Error("Expected success but got error");
        }

        expect(result.wallet).to.have.property("address");
        expect(result.message).to.equal("Wallet data retrieved successfully");
    });

    it("should return error when wallet not found", async () => {
        const result = await getEVMWallet({
            userId: "user_456",
            characterId: "char_456",
            network: Network.base,
            storage: mockStorage
        });

        expect(result).to.have.property("error", "WalletNotFound");
        expect(result.message).to.include("No wallet found for character");
    });

    it("should return error when RPC not found", async () => {
        const mockStorageNoRPC = {
            getItem: async (pk: string, sk: string) => {
                if (pk === "USER#user_123" && sk === "WALLET#char_123") {
                    return { privateKey: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" };
                }
                return null;
            },
        } as ToolStorage;

        const result = await getEVMWallet({
            userId: "user_123",
            characterId: "char_123",
            network: Network.base,
            storage: mockStorageNoRPC
        });

        expect(result).to.have.property("error", "RPCNotFound");
        expect(result.message).to.include("No RPC found for network");
    });

    it("should return error when wallet has no private key", async () => {
        const mockStorageInvalidWallet = {
            getItem: async (pk: string, sk: string) => {
                if (pk === "USER#user_123" && sk === "WALLET#char_123") {
                    return {}; // wallet without privateKey
                }
                if (pk === "RPC" && sk === "CHAIN#base") {
                    return { httpEndpoint: "https://base.example.com" };
                }
                return null;
            },
        } as ToolStorage;

        const result = await getEVMWallet({
            userId: "user_123",
            characterId: "char_123",
            network: Network.base,
            storage: mockStorageInvalidWallet
        });

        expect(result).to.have.property("error", "WalletNotFound");
        expect(result.message).to.include("No wallet found for character");
    });
});
