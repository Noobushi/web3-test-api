import { ApiProperty } from '@nestjs/swagger';
import { WalletDataDto } from './wallet-data.dto';

export class WalletResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: {
      address: '0x2287216a4B959B7D5ec001D8eCeA17A81c56fbF7',
      balance: '0.1 ETH',
    },
  })
  wallet: WalletDataDto;
}
