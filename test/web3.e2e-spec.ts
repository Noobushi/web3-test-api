import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Web3Service } from '../src/web3/web3.service';
import { ethers } from 'ethers';
import CounterJSON from '../src/web3/abi/Counter.json';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { Web3Controller } from '../src/web3/web3.controller';

describe('Web3Controller (E2E)', () => {
  let anvilProcess: ChildProcessWithoutNullStreams;
  let app: INestApplication;
  let provider: ethers.JsonRpcProvider;
  let wallet: ethers.Wallet;
  let contractAddress: string;

  beforeAll(async () => {
    anvilProcess = spawn('anvil', ['--port', '8545', '--block-time', '1']);
    const privateKey =
      '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e';
    provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    wallet = new ethers.Wallet(privateKey, provider);

    const factory = new ethers.ContractFactory(
      CounterJSON.abi,
      CounterJSON.bytecode,
      wallet,
    );
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();

    const moduleRef = await Test.createTestingModule({
      controllers: [Web3Controller],
      providers: [
        Web3Service,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'web3.rpcUrl':
                  return 'http://127.0.0.1:8545';
                case 'web3.privateKey':
                  return '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e';
                case 'web3.contractAddress':
                  return contractAddress;
                default:
                  return null;
              }
            },
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (anvilProcess) anvilProcess.kill();
  });

  it('/GET counter', async () => {
    const res = await request(app.getHttpServer()).get('/web3/counter');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe('0');
  });

  it('/POST increment', async () => {
    const res = await request(app.getHttpServer()).post('/web3/increment');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.newCount).toBe('1');
  });

  it('/GET contract-address', async () => {
    const res = await request(app.getHttpServer()).get(
      '/web3/contract-address',
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.contractAddress).toBe(contractAddress);
  });

  it('/GET wallet', async () => {
    const res = await request(app.getHttpServer()).get('/web3/wallet');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.wallet.address).toBe(wallet.address);
  });

  it('/GET network', async () => {
    const res = await request(app.getHttpServer()).get('/web3/network');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.network.chainId).toBe(
      Number(await provider.getNetwork().then((n) => n.chainId)),
    );
  });
});
