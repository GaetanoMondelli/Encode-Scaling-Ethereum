import { defineChain } from "viem";

export const presto = /*#__PURE__*/ defineChain({
  id: 686669576,
  name: "Presto",
  network: "presto",
  nativeCurrency: {
    decimals: 18,
    name: "Presto gateway.fm",
    symbol: "FM",
  },
  rpcUrls: {
    default: { http: ["https://sn2-stavanger-rpc.eu-north-2.gateway.fm"] },
    public: { http: ["https://sn2-stavanger-rpc.eu-north-2.gateway.fm"] },
  },
});
