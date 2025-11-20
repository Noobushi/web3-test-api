import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

jest.mock('./abi/Counter.json', () => ({
  abi: [],
}));

describe('Web3Service', () => {
  let service: Web3Service;
  let counterValue = 0;

  const mockGetCount = jest.fn().mockImplementation(async () => counterValue);
  const mockWait = jest.fn().mockResolvedValue({
    blockNumber: 123,
    from: '0xFrom',
    to: '0xTo',
    gasUsed: 21000n,
  });
  const mockIncrement = jest.fn().mockImplementation(async () => {
    counterValue++;
    return {
      hash: '0xTxHash',
      wait: mockWait,
    };
  });
  const mockGetBalance = jest.fn().mockResolvedValue(10000000000000000n);
  const mockGetNetwork = jest.fn().mockResolvedValue({
    chainId: 31337n,
    name: 'sepolia',
  });
  const mockResolveName = jest.fn().mockResolvedValue('0xMockAddress');
  const mockContract = {
    getCount: mockGetCount,
    increment: mockIncrement,
  };

  beforeAll(() => {
    jest.spyOn(ethers, 'JsonRpcProvider').mockImplementation((): any => ({
      getBalance: mockGetBalance,
      getNetwork: mockGetNetwork,
      resolveName: mockResolveName,
    }));

    jest.spyOn(ethers, 'Wallet').mockImplementation((): any => ({
      address: '0xMockWallet',
      provider: {
        resolveName: mockResolveName,
        getBalance: mockGetBalance,
        getNetwork: mockGetNetwork,
      },
    }));
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Web3Service,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'web3.rpcUrl':
                  return 'http://localhost:8545';
                case 'web3.privateKey':
                  return '0x123';
                case 'web3.contractAddress':
                  return '0xContractAddress';
              }
            },
          },
        },
      ],
    }).compile();

    service = module.get<Web3Service>(Web3Service);
    (service as any).contract = mockContract;
  });

  it('should return current count', async () => {
    const result = await service.getCount();

    expect(result.success).toBe(true);
    expect(result.count).toBe('0');
    expect(result.contractAddress).toBe('0xContractAddress');
  });

  it('should increment the counter', async () => {
    const result = await service.increment();

    expect(result.success).toBe(true);
    expect(result.newCount).toBe('1');
    expect(result.transactionHash).toBe('0xTxHash');
  });

  it('should return wallet info', async () => {
    const result = await service.getWallet();

    expect(result.wallet.address).toBe('0xMockWallet');
    expect(result.wallet.balance).toBe('0.01 ETH');
  });

  it('should return network info', async () => {
    const result = await service.getNetworkInfo();

    expect(result.network.chainId).toBe(31337);
    expect(result.network.name).toBe('sepolia');
  });

  it('should return contract address', () => {
    const result = service.getContractAddress();

    expect(result.success).toBe(true);
    expect(result.contractAddress).toBe('0xContractAddress');
  });
});
