import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider, Wallet, ethers } from 'ethers';
import CounterABI from './abi/Counter.json';
import { Counter } from './types/Counter';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);

  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private contractAddress: string;
  private contract: Counter;

  constructor(private readonly config: ConfigService) {
    const rpcUrl = this.config.get<string>('BASE_SEPOLIA_RPC_URL');
    const privateKey = this.config.get<string>('PRIVATE_KEY');
    const contractAddress = this.config.get<string>('CONTRACT_ADDRESS');

    if (!rpcUrl || !privateKey || !contractAddress) {
      this.logger.error('Missing required environment variables. Check BASE_SEPOLIA_RPC_URL, PRIVATE_KEY and CONTRACT_ADDRESS');
      throw new Error('Missing required environment variables for web3 service');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract( contractAddress, CounterABI, this.wallet) as unknown as Counter;
    
    this.logger.log(`Web3Service initialized. Provider RPC: ${rpcUrl}`);
    this.logger.log(`Using wallet: ${this.wallet.address}`);
    this.logger.log(`Connected to contract at: ${this.contractAddress}`);
  }

  async getCount(): Promise<{ success: boolean, count: string }> {
    try {
      this.logger.log('Calling contract.getCount()');
      const getCountResponse = await this.contract.getCount();
      const status = getCountResponse != null;
      this.logger.log(`getCount result: ${getCountResponse}`);

      return {
        success: status,
        count: getCountResponse.toString()
      }
    } catch (error) {
      this.logger.error('Error in getCount()', (error as Error).message);
      throw error;
    }
  }

    async increment(): Promise<{
        success: boolean;
        transactionHash: string;
        blockNumber: number;
        gasUsed: string;
        from: string;
        to: string;
        newCount: string;
    }> {
        try {
            this.logger.log('Sending increment() transaction to contract');
            const transactionRequest = await this.contract.increment();
            this.logger.log(`Transaction submitted: ${transactionRequest.hash}`);
            
            const transactionResponse = await transactionRequest.wait();
            const status = transactionResponse.status === 1;
            this.logger.log(`Transaction confirmed in block ${transactionResponse.blockNumber}`);

            const updatedCount = await this.contract.getCount();

            return {
                success: status,
                transactionHash: transactionRequest.hash,
                blockNumber: transactionResponse.blockNumber,
                gasUsed: transactionResponse.gasUsed.toString(),
                from: transactionResponse.from,
                to: transactionResponse.to,
                newCount: updatedCount.toString()
            };
        } catch (error) {
            this.logger.error('Error in increment()', (error as Error).message);
            throw error;
        }
    }

  getContractAddress(): { success: boolean, contactAddress: string } {
    const getContractAddressResponse = this.contractAddress;
    const status = getContractAddressResponse != null;
    return {
      success: status,
      contactAddress: getContractAddressResponse
    };
  }

  async getWallet(): Promise<{ success: boolean, address: string; balance: string }> {
    try {
      const balance = (await this.provider.getBalance(this.wallet.address)).toString();
      const status = balance != null;
      this.logger.log(`Wallet ${this.wallet.address} balance: ${balance}`);
      return {
        success: status, 
        address: this.wallet.address, 
        balance: balance };
    } catch (error) {
      this.logger.error('Error in getWallet()', (error as Error).message);
      throw error;
    }
  }

  async getNetworkInfo(): Promise<{ success: boolean, chainId: number, name: string }> {
    try {
      const network = await this.provider.getNetwork();
      const status = network != null;
      this.logger.log(`Connected network: ${network.name} (${network.chainId})`);
      return {
        success: status,
        chainId: Number(network.chainId),
        name: network.name };
    } catch (error) {
      this.logger.error('Error in getNetworkInfo()', (error as Error).message);
      throw error;
    }
  }
}

