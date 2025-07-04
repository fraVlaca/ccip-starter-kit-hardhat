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
