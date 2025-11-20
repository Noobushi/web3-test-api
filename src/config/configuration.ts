import { registerAs } from '@nestjs/config';

export default registerAs('web3', () => ({
  rpcUrl: process.env.BASE_SEPOLIA_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  contractAddress: process.env.CONTRACT_ADDRESS,
}));
