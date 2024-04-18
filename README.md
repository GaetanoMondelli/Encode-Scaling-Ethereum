# Encode-Scaling-Ethereum
[Scaling Web3 Hackathon by Encode](https://www.encode.club/scaling-web3-hackathon)

[Youtube Video](https://youtu.be/XFFX6IIjIs4)

# XTF PROTOCOL

XTF is a multichain and decentralised version of TradFi ETF.  XTF divides the ETF large bucket into smaller vaults, each mirroring the same asset mix on a smaller scale.This structure allows anyone -not only large organizations- to contribute to a vault’s asset collection and receive ETF share tokens in return.Assets are securely and transparently stored across different chains.We utilise bridges (Hyperlane) to track assets locked on other chains in Etherlink. When all the assets required by a vault are collected on all chains, ETF token shares are issued on Etherlink. The issuance is proportional to each contributor’s investment in the vault. The contribution to each vault depends on the quantity of assets deposited and the price of these assets at the time the vault is completed.Prices are fetched upon vault completion by RedStone


gh repo clone hyperlane-xyz/hyperlane-monorepo



# XTF ARCHITECTURE


![architecture](architecture.png)

XTF is a multichain protocol, so similar contracts are deployed to different chains. However, we distinguish:

- **Main chain**: The chain that tracks the global state of the assets across chains. It also issues ETF share tokens on vault completion and is the only chain that can burn a vault. In this demo example, **ETHERLINK** is going to be our main chain.

- **Side chain**: Other chains where assets are blocked. After each deposit, they notify the Main chain. Assets can only be released if the main chain sends a *burn* message to them. In this demo example, **ETHERLINK** is going to be our side chain.

---

XTF splits the large ETF bucket into smaller vaults to make investments more manageable. This diagram shows the lifecycle of each vault:

- **Empty**: Initially, the vault is empty, and users can deposit assets.
- **Open**: Some users have deposited assets on the main chain or on some of the tracked side chains.
- **Minted**: All the required assets have been deposited, the underlying assets have been locked, and ETF share tokens have been issued to contributors proportionally to their contributions.
- **Burned**: A user has decided to exchange a determined amount of ETF share tokens back for the underlying assets of the vault.


---

We mentioned that XTF is multi-chain, so we need messages to be exchanged between chains. To achieve that in this demo, we deployed a [Hyperlane](https://www.hyperlane.xyz/) bridge between Sepolia and Etherlink. I have included a convenient [script](https://github.com/GaetanoMondelli/Encode-Scaling-Ethereum/blob/main/create_bridge.sh) that clones the Hyperlane bridge repository, installs Rust, builds the bridge, and runs three components within the same script. It will also handle the script exit by waiting for the processes to exit:

**Sepolia Validator**: This component has a trusted account that, when it sees certain events being emitted, will look up the transaction with the message to exchange, sign it, and make it available to be bridged.
**Etherlink Validator**: Same as the Sepolia validator but for Etherlink.
**Relayer {Sepolia, Etherlink}**: Every time a validator makes validated messages available, it will bridge them to the destination chain.
In the following [folder](https://github.com/GaetanoMondelli/Encode-Scaling-Ethereum/tree/main/bridge/configs), we can find the configuration files used to set up the bridge between Etherlink and Sepolia and the security model used in this configuration.



The supported messages are:

- **Deposit**: From sidechain (Sepolia) to mainchain (Etherlink), to inform the mainchain that a deposit has been made in the sidechain.
- **Burn**: From mainchain (Etherlink) to sidechain (Sepolia), to inform a sidechain that a vault has been burned.
Hyperlane bridges always invoke the handle function with the message. Based on the message, the chain can execute code.

In the beginning, side chain and main chain code were separated into two separate contracts. However, I decided to merge them as having the same contract improved the UI with Viem and Wagmi (see the demo video).


```java
function handle(
		uint32 _origin,
		bytes32 _sender,
		bytes calldata _message
	) external payable {
		require(
			isMainChain() && bytes32ToAddress(_sender) == sideChainLock,
			"Sender to mainChain is not the sideChainLock"
		);

		require(
			!isMainChain() && bytes32ToAddress(_sender) == mainChainLock,
			"Sender to sideChain is not the mainChainLock"
		);


		if(isMainChain()) {
            // Deposit message! Sidechain -> Mainchain
			DepositInfo memory _depositInfo = abi.decode(_message, (DepositInfo));
			// uint32 _chainId = _depositInfo.tokens[0]._chainId;
			_deposit(_depositInfo, chainId);
			return;
		}
		else {
            // Burn message Mainchain -> Sidechain
			uint256 _vaultId = abi.decode(_message, (uint256));
			burn(_vaultId);
		}
	}

```

---

# TOKENOMICS

We also mentioned that when a vault is minted, we need to establish how many ETF Share tokens each user is getting based on their contribution to that vault. The following formula shows how Tmu (total ETF minted per user) is calculated:


![formula.png](formula.png)



For calculating the price of each token (Pti), we use price oracles. In this example, we used Redstone oracles deployed in Etherlink, and for tests, we also added a ChainLink V3 interface.

[ETF contract](etherlink/packages/hardhat/contracts/ETFLock.sol)


```java
import "@redstone-finance/evm-connector/contracts/data-services/RapidDemoConsumerBase.sol";
...
contract ETFLock is RapidDemoConsumerBase {


\\ In the deposit function when we need to calculate the contribution we use Redstone/ chainlink oracle
\\ For simplicity the Redstone one returns always the price for BNB 


		if (isMainChain()) {
				if (accountContributionsPerVault[_vaultId][_tokens[i]._contributor] == 0) {
					contributorsByVault[_vaultId].push(_tokens[i]._contributor);
				}

				bytes32[] memory dataFeedIds = new bytes32[](6);
				dataFeedIds[0] = bytes32("BNB");
				uint256[] memory prices = getOracleNumericValuesFromTxMsg(dataFeedIds);

				uint256 price = prices[0];

...
\\ Or using ChainLink  
		    uint256 price = AggregatorV3Interface(_tokens[i]._aggretator).latestRoundData().answer;
			(, /* uint80 roundID */ int answer, , , ) = AggregatorV3Interface(_tokens[i]._aggregator).latestRoundData();

// contribution calculation

				accountContributionsPerVault[_vaultId][_tokens[i]._contributor] += _tokens[i]
					._quantity * price;

...


```

Please note that the ChainLink oracle is always returning a fixed value decided during deployment.

[MockAggregator.sol](etherlink/packages/hardhat/contracts/MockAggregator.sol)


# TECH STACH


For this demo, I utilizsd Scaffold-Eth to quickly set up a Hardhat project connected to a Next.js React application. This is used with Viem and Wagmi, allowing automatic interaction with the contracts. Additional frontend libraries and resources were employed to improve the user interface, including the Ant Design (antd) React framework, Neobrutalism CSS theme, ApexCharts for vault selection, and React Chart.js for the pie chart.

Smart contract development used Hardhat, with core unit tests (found in the test folder) to verify the contract functionalities. To get familiar with Hyperlane and Redstone, you can find tests for basic use cases of these technologies in the contracts folder and the test folder.

Since assets are securely and transparently stored across different blockchains, we are using QuickNode to access a dedicated Sepolia node. A dedicated node for Etherlink was not necessary during development as the provided RPC URL was sufficient to handle all the traffic.

Note that during the demo, while a Sepolia transaction usually takes a few seconds and requires a refresh, the Etherlink transaction is almost instantaneous, and the refresh of the page is not always necessary.

# Contracts: 

- `ETFLock.sol`: The contract used by both the mainchain and sidechain to handle the deposit of assets, contributions calculation, message exchange, and ETF share token issuance.
- `SimpleERC20.sol`: A simple OpenZeppelin ERC20 token implementation used for representing the assets in the index tracked by the vaults and the ETF share token.
- `ETFSide.sol`: The initial implementation for the ETF lock to be deployed on sidechains.
- `ExampleRedstoneShowroom.sol` & `Rapid.Sol`: Examples of a Redstone contract using Redstone that requires wrapping the library in the frontend. The library was not fully compatible with this version of Scaffold-Eth, and it was much easier to use the Chainlink aggregator for this demo.
- `HyperlaneMessageReceiver.sol`: An example of a Hyperlane-compatible message receiver.
- `HyperlaneMessageSender.sol`: An example of a Hyperlane-compatible message sender.
- `MockAggregator.sol`: A contract implementing the `AggregatorV3Interface` from Chainlink. This is how a price oracle would look like if Etherlink was supported by Chainlink Data Feed.
- `MockRouter.sol` & `TestMailBox.sol`: Mock router for unit-testing the Hyperlane bridge.

# TEST

The [ETFLock.test](etherlink/packages/hardhat/test/ETFLock.ts) checks basic construction and operations of the ETF lock. 


# DEPLOYMENT Script


The following [deployment script](etherlink/packages/hardhat/deploy/02_deploy_etf.ts) deploys all the required assets to run the demo. Note that some pieces were commented out because you run that script in multiple runs.

1. First, you deploy the main chain Etherlink contract with npm run deploy-etherlink, which deploys all required asset tokens in that chain along with price oracles if required.
2. Then, you set the main chain ETFLock address as a constructor parameter for the ETFLock contract in Sepolia.
3. You then run the same script with npm run deploy-sepolia.
4. Finally, we need to re-run the Etherlink part with npm run deploy-etherlink, commenting out the deployment part (to avoid the creation of a new instance) and commenting out the part where we set the sidechain parameter with the address of the sidechain contract deployed in Sepolia.
This information is needed to route messages between different chains.