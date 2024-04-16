
#!/bin/bash
if [ ! -d "hyperlane-monorepo" ]; then
    echo "Directory hyperlane-monorepo does not exist."
    gh repo clone hyperlane-xyz/hyperlane-monorepo
fi

export HYP_KEY="0x1294695293f333466d699cca83fce35cf2c3dd960fd35a93d44ae548835c9b32"

echo $HYP_KEY

echo "Directory hyperlane-monorepo exists." 
cd hyperlane-monorepo/rust

export CONFIG_FOLDER=../../bridge/configs
export ART_FOLDER=../../bridge/artifacts
export VALIDATOR_SIGNATURES_DIR=../../bridge/validator_signatures
export DB_RELAYER=../../bridge/hyperlane_db_relayer
export DB_VALIDATOR=../../bridge/hyperlane_db_validator

export VALIDATOR_SIGNATURES_DIR_SEPOLIA=../../bridge/validator_signatures_sepolia
export DB_VALIDATOR_SEPOLIA=../../bridge/hyperlane_db_validator_sepolia




if [ ! -d "$CONFIG_FOLDER" ]; then
    echo "Directory $CONFIG_FOLDER does not exist."
    exit 1
fi

rustup --version

# if the artifacts folder contains files skip the deploy

if [ "$(ls -A $ART_FOLDER)" ]; then
echo "Artifacts folder is not empty. Skipping deploy."
else
echo "Artifacts folder is empty. Deploying."

rm -rf $DB_RELAYER
rm -rf $DB_VALIDATOR

hyperlane deploy core \
    --targets etherlink,sepolia \
    --chains $CONFIG_FOLDER/chains.yaml \
    --ism $CONFIG_FOLDER/ism.yaml \
    --out $ART_FOLDER \
    --key $HYP_KEY  \
    --yes 

fi



export ARG_FILE=$(ls -t $ART_FOLDER | grep -E "agent-config-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}.json" | head -n 1)

export CONFIG_FILES=$ART_FOLDER/$ARG_FILE

echo $CONFIG_FILES

ls -l $CONFIG_FILES


cleanup() {
    echo "Cleaning up and terminating processes..."
    kill "$pid1" "$pid2" "$pid3"
    exit
}

trap cleanup SIGINT



# Start the first process (validator) in the background
cargo run --release --bin validator -- \
    --db $DB_VALIDATOR \
    --originChainName etherlink \
    --checkpointSyncer.type localStorage \
    --checkpointSyncer.path $VALIDATOR_SIGNATURES_DIR \
    --validator.key $HYP_KEY &
pid1=$!

# # Start the second process (relayer) in the background
cargo run --release --bin relayer -- \
    --db $DB_RELAYER \
    --relayChains etherlink,sepolia \
    --allowLocalCheckpointSyncers true \
    --defaultSigner.key $HYP_KEY \
    --metrics-port 9091 &
pid2=$!

cargo run --release --bin validator -- \
    --db $DB_VALIDATOR_SEPOLIA \
    --originChainName sepolia \
    --checkpointSyncer.type localStorage \
    --checkpointSyncer.path $VALIDATOR_SIGNATURES_DIR_SEPOLIA \
    --validator.key $HYP_KEY &
pid3=$!

# Wait for both processes to finish
wait "$pid1" "$pid2" "$pid3"

echo "Both processes have finished."
