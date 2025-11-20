import { ApiProperty } from '@nestjs/swagger';

export class IncrementResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Counter incremented successfully' })
  message: string;

  @ApiProperty({
    example:
      '0x7bac0387a69ae1ffad672edc4723a2e849ff48d8c1515059af6a3cb7b4a9b233',
  })
  transactionHash: string;

  @ApiProperty({ example: 33807328 })
  blockNumber: number;

  @ApiProperty({ example: '0x6cac3a2efb4bD0684854d55dFee38201E16d8001' })
  from: string;

  @ApiProperty({ example: '0x2287216a4B959B7D5ec001D8eCeA17A81c56fbF7' })
  to: string;

  @ApiProperty({ example: '0.000000054575081587 ETH' })
  gasUsed: string;

  @ApiProperty({ example: '1' })
  newCount: string;
}
