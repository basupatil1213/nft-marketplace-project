import { defineChain } from "viem";

// Base chain
export const tenderly = defineChain({
  id: 11155111,
  name: "tenderly",
  nativeCurrency: { name: "tenderly", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || ""],
    },
  },
  blockExplorers: {
    default: {
      name: "nft-marketplace",
      url: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "",
    },
  },
});