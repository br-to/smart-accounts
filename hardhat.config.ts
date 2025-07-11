import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      evmVersion: 'cancun',
      optimizer: {
        enabled: true,
        // コントラクトが何回実行されるかを想定した設定
        // アカウントアブストラクションでは、トランザクションの実行回数が多くなるため、最適化を強化
        runs: 1000,
      },
    },
  },
};

export default config;
