import { expect } from "chai";
import { ToolStorage } from "../../../../src/storage/ToolStorage";
import { getWallet } from "../../../../src/tools/evm_wallet/get_wallet";

describe("getWallet", () => {
    const mockStorage = {
        getItem: async (pk: string, sk: string) => {
            if (pk === "USER#user_123" && sk === "WALLET#char_123") {
                return { privateKey: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" }; // Valid private key
            }
            if (pk === "RPC" && sk === "CHAIN#8453") {
                return { httpEndpoint: "https://base.example.com" };
            }
            return null;
        },
    } as ToolStorage;

    it("should retrieve wallet data successfully", async () => {
        const result = await getWallet(
            "user_123",
            "char_123",
            8453,
            mockStorage
        );

        expect(result).to.have.property("wallet_data");
        expect(result.wallet_data).to.have.property("address");
        expect(result.message).to.equal("Wallet data retrieved successfully");
    });

    it("should return error when wallet not found", async () => {
        const result = await getWallet(
            "user_456",
            "char_456",
            8453,
            mockStorage
        );

        expect(result).to.have.property("error", "WalletNotFound");
        expect(result.message).to.include("No wallet found for character");
    });

    it("should return error when RPC not found", async () => {
        const result = await getWallet(
            "user_123",
            "char_123",
            1,
            mockStorage
        );

        expect(result).to.have.property("error", "RPCNotFound");
        expect(result.message).to.include("No RPC found for chain");
    });
});
