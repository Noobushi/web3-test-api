import { Module } from '@nestjs/common';
import { Web3Controller } from './web3.controller';
import { Web3Service } from './web3.service';
import { ConfigModule } from '@nestjs/config';

/* Before adding config module to the imports the e2e test module creation did not work. Cant explain why...
Only the service is exported here, so why the e2e test can see web3Controller? */
@Module({
  imports: [ConfigModule],
  controllers: [Web3Controller],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
