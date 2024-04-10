# Encode-Scaling-Ethereum
https://www.encode.club/scaling-web3-hackathon


gh repo clone hyperlane-xyz/hyperlane-monorepo


hyperlane deploy core \
    --targets etherlink,sepolia
    --chains ./configs/chains.yaml
    --ism ./configs/ism.yaml
    --key "0x1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32"

rust % CONFIG_FILES=./agent-config-2024-04-04-16-16-27.json cargo run --release --bin validator -- \
    --db ../hyperlane_db_validator_etherlink \
    --originChainName etherlink \
    --checkpointSyncer.type localStorage \
    --checkpointSyncer.path ./signer-etherlink \
    --validator.key "0x1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32"


    rust % CONFIG_FILES=./agent-config-2024-04-04-16-16-27.json cargo run --release --bin validator -- \
    --db ../hyperlane_db_validator_etherlink \
    --originChainName etherlink \
    --checkpointSyncer.type localStorage \
    --checkpointSyncer.path $VALIDATOR_SIGNATURES_DIR \
    --validator.key "0x1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32"

   CONFIG_FILES=./agent-config-2024-04-04-16-16-27.json cargo run --release --bin relayer -- \
    --db ./hyperlane_db_relayer \
    --relayChains etherlink,sepolia \
    --allowLocalCheckpointSyncers true \
    --defaultSigner.key "0x1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32" \
    --metrics-port 9091