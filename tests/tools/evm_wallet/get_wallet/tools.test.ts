import { expect } from "chai";
import { ToolStorage } from "../../../../src/storage/ToolStorage";
import { getWallet } from "../../../../src/tools/evm_wallet/get_wallet";
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
        const result = await getWallet({
            userId: "user_123",
            characterId: "char_123",
            network: Network.base,
            storage: mockStorage
        });

        expect(result).to.have.property("wallet");
        expect(result.wallet).to.have.property("address");
        expect(result.message).to.equal("Wallet data retrieved successfully");
    });

    it("should return error when wallet not found", async () => {
        const result = await getWallet({
            userId: "user_456",
            characterId: "char_456",
            network: Network.base,
            storage: mockStorage
        });

        expect(result).to.have.property("error", "WalletNotFound");
        expect(result.message).to.include("No wallet found for character");
    });


});
