export class IncrementResponseDto {
  success: boolean;
  message: string;
  transactionHash: string;
  blockNumber: number;
  from: string;
  to: string;
  gasUsed: string;
  newCount: string;
}
