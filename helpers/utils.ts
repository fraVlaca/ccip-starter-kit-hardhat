import {
  CCIP_BnM_ADDRESSES,
  CCIP_LnM_ADDRESSES,
  LINK_ADDRESSES,
  PayFeesIn,
  routerConfig,
} from "./constants";
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Cache for loaded YAML configuration
let cachedYamlConfig: any = null;

// Load YAML configuration
function loadYamlConfig() {
  if (cachedYamlConfig) {
    return cachedYamlConfig;
  }

  try {
    const configPath = path.join(__dirname, '../../../public/network-config.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    cachedYamlConfig = yaml.load(fileContents) as any;
    return cachedYamlConfig;
  } catch (error) {
    console.error('Error loading YAML config:', error);
    throw new Error('Failed to load network configuration from YAML file');
  }
}

// Get network configuration by key
function getNetworkConfig(networkKey: string) {
  const config = loadYamlConfig();
  const network = config.networks.find((n: any) => n.key === networkKey);
  
  if (!network) {
    const availableNetworks = config.networks.map((n: any) => n.key).join(', ');
    throw new Error(`Unknown network: ${networkKey}. Available networks: ${availableNetworks}`);
  }
  
  return network;
}

// Get token addresses by symbol
function getTokenAddresses(symbol: string) {
  const config = loadYamlConfig();
  const token = config.tokens.find((t: any) => t.symbol === symbol);
  return token ? token.addresses : {};
}

export const getProviderRpcUrl = (network: string) => {
  const networkConfig = getNetworkConfig(network);
  
  if (!networkConfig.rpcUrls || networkConfig.rpcUrls.length === 0) {
    throw new Error(`No RPC URLs configured for network: ${network}`);
  }
  
  // Return the first RPC URL
  return networkConfig.rpcUrls[0];
};

export const getPrivateKey = () => {
  const privateKey = process.env.PRIVATE_KEY || process.env.HARDHAT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "Private key not provided - check your PRIVATE_KEY or HARDHAT_PRIVATE_KEY environment variables"
    );
  }

  return privateKey;
};

export const getRouterConfig = (network: string) => {
  const networkConfig = getNetworkConfig(network);
  
  if (!networkConfig.routerAddress || !networkConfig.chainSelector) {
    throw new Error(`Router configuration not available for network: ${network}`);
  }
  
  // Build router config object
  const routerConfig = {
    address: networkConfig.routerAddress,
    chainSelector: networkConfig.chainSelector,
    feeTokens: []
  };
  
  // Add LINK token if available
  if (networkConfig.linkContract) {
    routerConfig.feeTokens.push(networkConfig.linkContract as never);
  }
  
  // Add native token address if available (this varies by network)
  const nativeTokenAddresses: { [key: string]: string } = {
    'sepolia': '0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534', // ETH
    'arbitrumSepolia': '0xE591bf0A0CF924A0674d7792db046B23CEbF5f34', // ETH
    'polygonAmoy': '0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9', // MATIC
    'optimismSepolia': '0x4200000000000000000000000000000000000006', // ETH
    'baseSepolia': '0x4200000000000000000000000000000000000006', // ETH
    'avalancheFuji': '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', // AVAX
    'bscTestnet': '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', // BNB
  };
  
  if (nativeTokenAddresses[network]) {
    routerConfig.feeTokens.push(nativeTokenAddresses[network] as never);
  }
  
  return routerConfig;
};

export const getPayFeesIn = (payFeesIn: string) => {
  let fees;

  switch (payFeesIn) {
    case "Native":
    case "native":
      fees = PayFeesIn.Native;
      break;
    case "LINK":
    case "link":
      fees = PayFeesIn.LINK;
      break;
    default:
      fees = PayFeesIn.Native;
      break;
  }

  return fees;
};

export const getFaucetTokensAddresses = (network: string) => {
  const ccipBnMAddresses = getTokenAddresses('CCIP-BnM');
  const ccipLnMAddresses = getTokenAddresses('CCIP-LnM');
  
  return {
    ccipBnM: ccipBnMAddresses[network],
    ccipLnM: ccipLnMAddresses[network],
  };
};

export const getLINKTokenAddress = (network: string) => {
  const networkConfig = getNetworkConfig(network);
  return networkConfig.linkContract;
};

// Additional helper functions
export const getChainSelector = (network: string) => {
  const networkConfig = getNetworkConfig(network);
  return networkConfig.chainSelector;
};

export const getBlockExplorer = (network: string) => {
  const networkConfig = getNetworkConfig(network);
  return networkConfig.blockExplorer;
};

export const getTokenAddress = (symbol: string, network: string) => {
  const tokenAddresses = getTokenAddresses(symbol);
  return tokenAddresses[network];
};

// Get all available networks
export const getAvailableNetworks = () => {
  const config = loadYamlConfig();
  return config.networks.map((n: any) => ({
    key: n.key,
    name: n.name,
    chainId: n.id,
    testnet: n.testnet
  }));
};
