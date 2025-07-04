import * as dotenvenc from "@chainlink/env-enc";
dotenvenc.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks";
import "./tasks/ccip-1_5-tasks";
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

// Load YAML network configuration
function loadNetworkConfig() {
  try {
    const configPath = path.join(__dirname, '../../public/network-config.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents) as any;
  } catch (error) {
    console.warn('Could not load network config from YAML, using fallback configuration');
    return { networks: [] };
  }
}

// Generate networks from YAML config
function generateNetworks() {
  const yamlConfig = loadNetworkConfig();
  const networks: any = {
    hardhat: {
      chainId: 31337,
    }
  };

  // Use HARDHAT_PRIVATE_KEY for all networks
  const privateKey = process.env.HARDHAT_PRIVATE_KEY || process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.warn('⚠️  HARDHAT_PRIVATE_KEY environment variable not set. Networks will be configured without accounts.');
  }

  // Add networks from YAML config
  for (const network of yamlConfig.networks || []) {
    if (network.rpcUrls && network.rpcUrls.length > 0) {
      networks[network.key] = {
        url: network.rpcUrls[0],
        chainId: network.id,
        accounts: privateKey ? [privateKey] : []
      };
    }
  }

  return networks;
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHEREUM_SEPOLIA_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
const OPTIMISM_SEPOLIA_RPC_URL = process.env.OPTIMISM_SEPOLIA_RPC_URL;
const ARBITRUM_SEPOLIA_RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL;
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL;
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL;
const BNB_CHAIN_TESTNET_RPC_URL = process.env.BNB_CHAIN_TESTNET_RPC_URL;
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;
const KROMA_SEPOLIA_RPC_URL = process.env.KROMA_SEPOLIA_RPC_URL;
const WEMIX_TESTNET_RPC_URL = process.env.WEMIX_TESTNET_RPC_URL;
const GNOSIS_CHIADO_RPC_URL = process.env.GNOSIS_CHIADO_RPC_URL;
const CELO_ALFAJORES_RPC_URL = process.env.CELO_ALFAJORES_RPC_URL;
const METIS_SEPOLIA_RPC_URL = process.env.METIS_SEPOLIA_RPC_URL;
const ZKSYNC_SEPOLIA_RPC_URL = process.env.ZKSYNC_SEPOLIA_RPC_URL;
const SCROLL_SEPOLIA_RPC_URL = process.env.SCROLL_SEPOLIA_RPC_URL;
const ZIRCUIT_SEPOLIA_RPC_URL = process.env.ZIRCUIT_SEPOLIA_RPC_URL;
const XLAYER_SEPOLIA_RPC_URL = process.env.XLAYER_SEPOLIA_RPC_URL;
const POLYGON_ZKEVM_SEPOLIA_RPC_URL = process.env.POLYGON_ZKEVM_SEPOLIA_RPC_URL;
const POLKADOT_ASTAR_SHIBUYA_RPC_URL = process.env.POLKADOT_ASTAR_SHIBUYA_RPC_URL;
const MANTLE_SEPOLIA_RPC_URL = process.env.MANTLE_SEPOLIA_RPC_URL;
const SONEIUM_MINATO_SEPOLIA_RPC_URL = process.env.SONEIUM_MINATO_SEPOLIA_RPC_URL;
const BSQUARED_TESTNET_RPC_URL = process.env.BSQUARED_TESTNET_RPC_URL;
const BOB_SEPOLIA_RPC_URL = process.env.BOB_SEPOLIA_RPC_URL;
const WORLDCHAIN_SEPOLIA_RPC_URL = process.env.WORLDCHAIN_SEPOLIA_RPC_URL;
const SHIBARIUM_TESTNET_RPC_URL = process.env.SHIBARIUM_TESTNET_RPC_URL;
const BITLAYER_TESTNET_RPC_URL = process.env.BITLAYER_TESTNET_RPC_URL;
const FANTOM_SONIC_TESTNET_RPC_URL = process.env.FANTOM_SONIC_TESTNET_RPC_URL;
const CORN_TESTNET_RPC_URL = process.env.CORN_TESTNET_RPC_URL;
const HASHKEY_SEPOLIA_RPC_URL = process.env.HASHKEY_SEPOLIA_RPC_URL;
const INK_SEPOLIA_RPC_URL = process.env.INK_SEPOLIA_RPC_URL;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "paris",
    }
  },
  networks: generateNetworks(),
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
