import { Controller, Get, Post } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { CountResponseDto } from './dto/count-response.dto';
import { IncrementResponseDto } from './dto/increment-response.dto';
import { ContractAddressResponseDto } from './dto/contract-address-response.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { NetworkResponseDto } from './dto/network-response.dto';

@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('counter')
  async getCount(): Promise<CountResponseDto> {
    return await this.web3Service.getCount();
  }

  @Post('increment')
  async increment(): Promise<IncrementResponseDto> {
    return await this.web3Service.increment();
  }

  @Get('contract-address')
  getContractAddress(): ContractAddressResponseDto {
    return this.web3Service.getContractAddress();
  }

  @Get('wallet')
  async getWallet(): Promise<WalletResponseDto> {
    return await this.web3Service.getWallet();
  }

  @Get('network')
  async getNetworkInfo(): Promise<NetworkResponseDto> {
    return await this.web3Service.getNetworkInfo();
  }
}
