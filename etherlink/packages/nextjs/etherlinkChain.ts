import { defineChain } from "viem";

export const etherlink = /*#__PURE__*/ defineChain({
  id: 128123,
  name: "Etherlink",
  network: "etherlink",
  nativeCurrency: {
    decimals: 18,
    name: "Etherlink",
    symbol: "XTZ",
  },
  rpcUrls: {
    default: { http: ["https://node.ghostnet.etherlink.com"] },
    public: { http: ["https://node.ghostnet.etherlink.com"] },
  },
});
