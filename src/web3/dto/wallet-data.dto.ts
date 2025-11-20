import { ApiProperty } from '@nestjs/swagger';

export class WalletDataDto {
  @ApiProperty({ example: '0x2287216a4B959B7D5ec001D8eCeA17A81c56fbF7' })
  address: string;

  @ApiProperty({ example: '0.1 ETH' })
  balance: string;
}
