import { Controller, Get, Post } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { CountResponseDto } from './dto/count-response.dto';
import { IncrementResponseDto } from './dto/increment-response.dto';
import { ContractAddressResponseDto } from './dto/contract-address-response.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { NetworkResponseDto } from './dto/network-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('web3')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  /* If there are many error cases for specific endpoint, is there a better way than overflowing the screen with @ApiResponse annotation? 
  Seems not worth it to me for Swagger purpose only */
  @ApiResponse({
    status: 200,
    description: 'Counter value retrieved successfully',
    type: CountResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch count from blockchain',
  })
  @ApiResponse({
    status: 503,
    description: 'RPC node unavailable',
  })
  @Get('counter')
  async getCount(): Promise<CountResponseDto> {
    return await this.web3Service.getCount();
  }

  @ApiResponse({
    status: 200,
    description: 'Increments counter value successfully',
    type: IncrementResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch increment from blockchain',
  })
  @ApiResponse({
    status: 402,
    description: 'Insufficient funds for transaction gas',
  })
  @Post('increment')
  async increment(): Promise<IncrementResponseDto> {
    return await this.web3Service.increment();
  }

  @ApiResponse({
    status: 200,
    description: 'Contract address value retrieved successfully',
    type: ContractAddressResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch contract address from blockchain',
  })
  @Get('contract-address')
  getContractAddress(): ContractAddressResponseDto {
    return this.web3Service.getContractAddress();
  }

  @ApiResponse({
    status: 200,
    description: 'Wallet value retrieved successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch wallet from blockchain',
  })
  @Get('wallet')
  async getWallet(): Promise<WalletResponseDto> {
    return await this.web3Service.getWallet();
  }

  @ApiResponse({
    status: 200,
    description: 'Network value retrieved successfully',
    type: NetworkResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch network from blockchain',
  })
  @ApiResponse({
    status: 503,
    description: 'RPC node unavailable',
  })
  @Get('network')
  async getNetworkInfo(): Promise<NetworkResponseDto> {
    return await this.web3Service.getNetworkInfo();
  }
}
