import { ApiProperty } from '@nestjs/swagger';

export class CountResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '0' })
  count: string;

  @ApiProperty({ example: '0x2287216a4B959B7D5ec001D8eCeA17A81c56fbF7' })
  contractAddress: string;
}
