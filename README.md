# Web3 API – NestJS + Ethers.js

A minimal NestJS backend to interact with an on-chain `Counter` smart contract on Base Sepolia testnet.

## Project Structure

api/
├── src/
│   ├── web3/
│   │   ├── web3.module.ts
│   │   ├── web3.service.ts
│   │   ├── web3.controller.ts
│   │   ├── dto/
│   │   │   ├── contract-address-response.dto.ts
│   │   │   ├── count-response.dto.ts
│   │   │   ├── increment-response.dto.ts
│   │   │   ├── network-data.dto.ts
│   │   │   ├── network-response.dto.ts
│   │   │   ├── wallet-data.dto.ts
│   │   │   └── global.exception.filter.ts
│   │   ├── abi/              # Contract ABIs (provided)
│   │   └── types/            # TypeChain generated types (provided)
│   ├── config/
│   │   ├── configuration.ts
│   │   └── global.exception.filter.ts
│   ├── filter/
│   │   └── web3.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── jest-e2e.json
│   └── web3.e2e-spec.ts
├── package.json
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.build.json
└── tsconfig.json

## Setup

1. Install dependencies with:
pnpm install

2. Create .env file following .env.example instructions

3. Run the project via: 
pnpm run start

## Swagger/API documentation

Swagger is available at:
http://localhost:3000/api

## Running Tests

Run unit test for all service methods via:
pnpm test

Run end two end test for all endpoints via:
pnpm test:e2e

//test commit