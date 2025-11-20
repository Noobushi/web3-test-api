import { ApiProperty } from '@nestjs/swagger';
import { NetworkDataDto } from './network-data.dto';

export class NetworkResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: { chainId: 11155111, name: 'Sepolia Testnet' } })
  network: NetworkDataDto;
}
