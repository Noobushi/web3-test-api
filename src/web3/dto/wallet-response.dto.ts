import { WalletDataDto } from './wallet-data.dto';

export class WalletResponseDto {
  success: boolean;
  wallet: WalletDataDto;
}
