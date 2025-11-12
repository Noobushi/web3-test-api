# Web3 API – NestJS + Ethers.js

A minimal NestJS backend to interact with an on-chain `Counter` smart contract on Base Sepolia testnet.

## Project Structure

api/
├── src/
│   ├── web3/
│   │   ├── web3.module.ts
│   │   ├── web3.service.ts
│   │   ├── web3.controller.ts
│   │   ├── abi/              # Contract ABIs (provided)
│   │   └── types/            # TypeChain generated types (provided)
│   ├── app.module.ts
│   └── main.ts
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
```bash
pnpm install

2. Create .env file following .env.example instructions

3. Run the project via: 
pnpm run start