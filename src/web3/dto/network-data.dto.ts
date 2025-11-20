import { ApiProperty } from '@nestjs/swagger';

export class NetworkDataDto {
  @ApiProperty({ example: '11155111' })
  chainId: number;

  @ApiProperty({ example: 'Sepolia Testnet' })
  name: string;
}
