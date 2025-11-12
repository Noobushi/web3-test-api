import { Module } from '@nestjs/common';
import { Web3Module } from './web3/web3.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    Web3Module,
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
