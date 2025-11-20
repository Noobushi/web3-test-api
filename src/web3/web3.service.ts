import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseContract, JsonRpcProvider, Wallet, ethers } from 'ethers';
import CounterJSON from './abi/Counter.json';
import { Counter } from './types/Counter';
import { CountResponseDto } from './dto/count-response.dto';
import { IncrementResponseDto } from './dto/increment-response.dto';
import { ContractAddressResponseDto } from './dto/contract-address-response.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { NetworkResponseDto } from './dto/network-response.dto';

@Injectable()
export class Web3Service {
  private readonly provider: JsonRpcProvider;
  private readonly wallet: Wallet;
  private readonly contractAddress: string;
  private readonly contract: Counter;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('web3.rpcUrl');
    const privateKey = this.configService.get<string>('web3.privateKey');
    this.contractAddress = this.configService.get<string>(
      'web3.contractAddress',
    );

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new BaseContract(
      this.contractAddress,
      CounterJSON.abi,
      this.wallet,
    ) as Counter;
  }

  async getCount(): Promise<CountResponseDto> {
    const count = await this.contract.getCount();
    return {
      success: true,
      count: count.toString(),
      contractAddress: this.contractAddress,
    };
  }

  async increment(): Promise<IncrementResponseDto> {
    const incrementRequest = await this.contract.increment();
    const incrementResponse = await incrementRequest.wait();
    const updatedCount = await this.contract.getCount();

    return {
      success: true,
      message: 'Counter incremented successfully',
      transactionHash: incrementRequest.hash,
      blockNumber: incrementResponse.blockNumber,
      from: incrementResponse.from,
      to: incrementResponse.to,
      gasUsed: incrementResponse.gasUsed.toString(),
      newCount: updatedCount.toString(),
    };
  }

  getContractAddress(): ContractAddressResponseDto {
    return {
      success: true,
      contractAddress: this.contractAddress,
    };
  }

  async getWallet(): Promise<WalletResponseDto> {
    const balanceWei = await this.provider.getBalance(this.wallet.address);
    const balanceEth = ethers.formatEther(balanceWei);
    return {
      success: true,
      wallet: {
        address: this.wallet.address,
        balance: `${balanceEth} ETH`,
      },
    };
  }

  async getNetworkInfo(): Promise<NetworkResponseDto> {
    const network = await this.provider.getNetwork();
    return {
      success: true,
      network: {
        chainId: Number(network.chainId),
        name: network.name,
      },
    };
  }
}
