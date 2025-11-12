import { Controller, Get, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { Web3Service } from './web3.service';

@Controller('web3')
export class Web3Controller {
    private readonly logger = new Logger(Web3Controller.name);
    constructor(private readonly web3Srvice: Web3Service){}

    @Get('count')
    async getCount(): Promise<{ success: boolean, count: string, contractAdress: string}> {
        try {
            const countResponse = await this.web3Srvice.getCount();
            const getContractAddressResponse = this.web3Srvice.getContractAddress();
            
            return{
                success: countResponse.success,
                count: countResponse.count,
                contractAdress: getContractAddressResponse.contactAddress
            };
        } catch (error){
            this.logger.error(`Error in Get /web3/count: ${(error as Error).message}`);
            throw new HttpException('Failed to fetch count', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Post('increment')
    async increment(): Promise<{
        success: boolean,
        message: string,
        transactionHash: string,
        blockNumber: number,
        from: string,
        to: string,
        gasUsed: string,
        newCount: string
    }> {
        try{
            const incrementResponse = await this.web3Srvice.increment();
            const defaultMessage = 'Counter incremented successfully';
            return {
                success: incrementResponse.success,
                message: defaultMessage,
                transactionHash: incrementResponse.transactionHash,
                blockNumber: incrementResponse.blockNumber,
                from: incrementResponse.from,
                to: incrementResponse.to,
                gasUsed: incrementResponse.gasUsed,
                newCount: incrementResponse.newCount
            }
        } catch(error) {
            this.logger.error(`Error in POST /web3/increment: ${(error as Error).message}`);
            throw new HttpException('Failed to increment counter', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('contract-address')
    getContractAddress(): { success: boolean, contractAddress: string }{
        try{
            const getContractAddressResponse =  this.web3Srvice.getContractAddress();
    
            return {
                success: getContractAddressResponse.success,
                contractAddress: getContractAddressResponse.contactAddress
            }
        } catch(error){
            this.logger.error(`Error in GET /web3/contract-addres: ${(error as Error).message}`);
            throw new HttpException('Failed to fetch contract address', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('wallet')
    async getWallet(): Promise<{ success: boolean, wallet: { address: string, balance: string } }>{
        try{
            const getWalletResponse = await this.web3Srvice.getWallet();

            return {
                success: getWalletResponse.success,
                wallet: {
                    address: getWalletResponse.address,
                    balance: getWalletResponse.balance
                }
            }
        } catch(error){
            this.logger.error(`Error in GET /web3/wallet: ${(error as Error).message}`);
            throw new HttpException('Failed to fetch wallet info', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('network')
    async getNetworkInfo(): Promise<{ success: boolean, netwrok: { chaindId: number, name: string } }>{
        try{
            const getNetworkInfoResponse = await this.web3Srvice.getNetworkInfo();

            return{
                success: getNetworkInfoResponse.success,
                netwrok: {
                    chaindId: getNetworkInfoResponse.chainId,
                    name: getNetworkInfoResponse.name
                }
            }
        } catch(error){
            this.logger.error(`Error in GET /web3/network: ${(error as Error).message}`);
            throw new HttpException('Failed to fetch network info', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
